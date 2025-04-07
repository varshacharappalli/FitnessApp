import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import useUserAuthStore from '../store/userAuth';
import useProfileStore from '../store/userProfile';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUserAuthStore();
  const { profile, userDetails, goals, activities, loading, error, fetchProfile } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    difficulty_level: 'Beginner'
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      height: profile?.height || '',
      weight: profile?.weight || '',
      difficulty_level: profile?.difficulty_level || 'Beginner'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useProfileStore.getState().updateProfile(formData);
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <div className="text-white">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-500 text-center p-4">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Difficulty Level</label>
                  <select
                    name="difficulty_level"
                    value={formData.difficulty_level}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-400 mb-1">Full Name</h4>
                    <p className="text-white text-lg">
                      {userDetails?.first_name} {userDetails?.last_name}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Username</h4>
                    <p className="text-white text-lg">{userDetails?.username}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Email</h4>
                    <p className="text-white text-lg">{userDetails?.email}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Gender</h4>
                    <p className="text-white text-lg">{userDetails?.gender}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Date of Birth</h4>
                    <p className="text-white text-lg">
                      {new Date(userDetails?.dob).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Age</h4>
                    <p className="text-white text-lg">{userDetails?.age} years</p>
                  </div>
                </div>
              </div>

              {/* Physical Information */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Physical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-400 mb-1">Height</h4>
                    <p className="text-white text-lg">{profile?.height} cm</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Weight</h4>
                    <p className="text-white text-lg">{profile?.weight} kg</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Difficulty Level</h4>
                    <p className="text-white text-lg">{profile?.difficulty_level}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Member Since</h4>
                    <p className="text-white text-lg">
                      {new Date(userDetails?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Activity Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-400 mb-1">Total Goals</h4>
                    <p className="text-white text-lg">{goals?.length || 0}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 mb-1">Total Activities</h4>
                    <p className="text-white text-lg">{activities?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile; 