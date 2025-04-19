import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import deleteAccount from "../components/api/deleteAccount";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/constants';
import WPMChart from "../components/Profile/WPMChart";
import ConfirmDeleteModal from "../components/Profile/ConfirmDeleteModal";
import getProfileStats from "../components/api/getProfileStats";
import StatButtonGroup from "../components/Profile/StatButtonGroup";
import UserBox from "../components/Profile/UserBox";
import StatGrid from "../components/Profile/StatGrid";


type Stats = {
  average_wpm: number;
  average_accuracy: number;
  highest_wpm: number;
  total_sessions: number;
};

type ProfileStats = {
  username: string;
  joined: string;
  overall: Stats;
  random: Stats;
  adaptive: Stats;
  adaptive_wpm_history: { date: string; wpm: number }[];
  random_wpm_history: { date: string; wpm: number }[];
};

const Profile = () => {
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getProfileStats();
        setProfileStats(data);
      } catch (err) {

        // Add some error handling
        console.error("Failed to load profile stats:", err);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    navigate("/logout")    
  }

  const handleDeleteAccount = async () => {
    // Display confirmation window

    try {
      await deleteAccount();

      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);

      navigate("/login/");
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  }

  return (
    <div>      
      <h2 className="text-5xl font-bold text-center mt-4 mb-5">Profile Overview</h2>

      <StatButtonGroup onLogout={handleLogout} onDelete={() => setShowConfirmModal(true)} />

      <div className="grid lg:grid-cols-[15%_1px_auto] grid-cols-1 gap-6 px-6 py-8 text-white rounded-xl shadow-md bg-gray-800">
        <UserBox username={profileStats?.username} joined={profileStats?.joined} />
        <div className="hidden md:block bg-gray-600 w-1 h-full mx-auto rounded" />
        <StatGrid stats={profileStats?.overall} />
      </div>

      <h2 className="text-5xl font-bold text-center mt-8 mb-5">Adaptive Test Stats</h2>
      <div className="px-6 py-8 text-white rounded-xl shadow-md bg-gray-800">
        <StatGrid stats={profileStats?.adaptive} />
      </div>
      <WPMChart data={profileStats?.adaptive_wpm_history} />

      <h2 className="text-5xl font-bold text-center mt-4 mb-5">Random Test Stats</h2>
      <div className="px-6 py-8 text-white rounded-xl shadow-md bg-gray-800">
        <StatGrid stats={profileStats?.random} />
      </div>
      <WPMChart data={profileStats?.random_wpm_history} />

      {showConfirmModal && (
        <ConfirmDeleteModal
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  )
}

export default Profile;