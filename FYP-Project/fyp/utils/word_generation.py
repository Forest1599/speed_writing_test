import random
from nltk.corpus import brown
from nltk import FreqDist
import Levenshtein
from ..models import TypingSession
from ..models import WordPerformance

# Global frequency distribution
ALL_WORDS = [w.lower() for w in brown.words() if w.isalpha()]
FREQ_DIST = FreqDist(ALL_WORDS)

# Constants
DEFAULT_MIN_LEN = 3
DEFAULT_MAX_LEN = 5
DEFAULT_FREQ_RANK = 500

MIN_LEN_LIMIT = 3
MAX_LEN_LIMIT = 10
MIN_FREQ_RANK = 500
MAX_FREQ_RANK = 5000

def get_typing_difficulty(user):
    min_len = DEFAULT_MIN_LEN
    max_len = DEFAULT_MAX_LEN
    freq_rank = DEFAULT_FREQ_RANK

    all_sessions = TypingSession.objects.filter(user=user).order_by('-timestamp')
    session_count = all_sessions.count()

    # Only adapt difficulty every 3rd session
    if session_count >= 4 and session_count % 3 == 0:
        latest = all_sessions[0]
        recent_sessions = all_sessions[1:4]  # last 3 before latest

        avg_wpm = sum(s.wpm for s in recent_sessions) / len(recent_sessions)
        avg_accuracy = sum(s.accuracy for s in recent_sessions) / len(recent_sessions)

        wpm_change = ((latest.wpm - avg_wpm) / avg_wpm) * 100 if avg_wpm else 0
        acc_change = latest.accuracy - avg_accuracy

        if wpm_change >= 10 and acc_change >= 0:
            min_len = min(MAX_LEN_LIMIT, min_len + 1)
            max_len = min(MAX_LEN_LIMIT, max_len + 1)
            freq_rank = min(MAX_FREQ_RANK, freq_rank + 500)

        elif wpm_change <= -10 and acc_change <= 0:
            min_len = max(MIN_LEN_LIMIT, min_len - 1)
            max_len = max(min_len, max_len - 1)
            freq_rank = max(MIN_FREQ_RANK, freq_rank - 500)

    return min_len, max_len, freq_rank


def get_struggled_words_from_last_sessions(user, max_sessions=5):
    sessions = TypingSession.objects.filter(user=user).order_by('-timestamp')[:max_sessions]

    word_data = WordPerformance.objects.filter(session__in=sessions)

    struggled = [
        wp.target_word for wp in word_data 
        if not wp.is_correct or wp.backspace_count >= 3
    ]

    # Return unique list while keeping order
    seen = set()
    return [w for w in struggled if not (w in seen or seen.add(w))]



def get_filtered_words(min_len, max_len, freq_rank):
    top_words = [word for word, _ in FREQ_DIST.most_common(freq_rank)]
    filtered_words = [word for word in top_words if min_len <= len(word) <= max_len]
    return filtered_words

def get_similar_words(base_word, word_pool, max_distance=2):
    return [
        word for word in word_pool
        if 1 <= Levenshtein.distance(base_word, word) <= max_distance
    ]

# Update the logic later on
def generate_words_for_user(user, num_words=200, similar_ratio=0.1):
    # Step 1: Get difficulty parameters for the user based on past performance
    min_len, max_len, freq_rank = get_typing_difficulty(user)

    # Step 2: Retrieve words within the specified difficulty range
    filtered = get_filtered_words(min_len, max_len, freq_rank)

    # Step 3: Fetch struggled words from the user's last few sessions
    struggled = get_struggled_words_from_last_sessions(user)
    similar_words = []

    # Step 4: Try to find similar words from the filtered pool for each struggled word
    for base_word in struggled:
        sims = get_similar_words(base_word, filtered)

        # If similar words are found, randomly select one to include
        if sims:
            similar_words.append(random.choice(sims))

        # Limit how many similar words we include (e.g., 10% of the total word count)
        if len(similar_words) >= int(num_words * similar_ratio):
            break

    # Step 5: Calculate how many more random words we need to reach the desired count
    remaining_needed = max(0, num_words - len(similar_words))

    # Step 6: Randomly sample the remaining words from the filtered pool
    random_words = random.sample(filtered, min(remaining_needed, len(filtered)))
    
    # Step 7: Combine similar and random words, then shuffle for varied placement
    all_words = random_words + similar_words
    random.shuffle(all_words)

    return {
        "words": all_words,
        "settings": {
            "min_word_length": min_len,
            "max_word_length": max_len,
            "word_frequency_rank": freq_rank
        }
    }