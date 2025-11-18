import React, { useState } from 'react';
import { Building2, Clock, Users, Package, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface OpeningHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface GymSpace {
  id: string;
  name: string;
  capacity: number;
  description: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface SoftwareModule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const GymSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hours' | 'spaces' | 'staff' | 'modules'>('hours');

  // Opening Hours State
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>([
    { day: 'Monday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
    { day: 'Tuesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
    { day: 'Wednesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
    { day: 'Thursday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
    { day: 'Friday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
    { day: 'Saturday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
    { day: 'Sunday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  ]);

  // Gym Spaces State
  const [gymSpaces, setGymSpaces] = useState<GymSpace[]>([
    { id: '1', name: 'Main Gym Floor', capacity: 50, description: 'Main workout area with cardio and weights' },
    { id: '2', name: 'Studio 1', capacity: 30, description: 'Group fitness classes' },
    { id: '3', name: 'Studio 2', capacity: 20, description: 'Yoga and Pilates' },
  ]);

  // Staff State
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: '1', name: 'Coach Alice', role: 'Head Coach', email: 'alice@gym.com', phone: '555-0101' },
    { id: '2', name: 'Coach Bob', role: 'Fitness Instructor', email: 'bob@gym.com', phone: '555-0102' },
  ]);

  // Software Modules State
  const [modules, setModules] = useState<SoftwareModule[]>([
    { id: '1', name: 'Class Scheduling', description: 'Schedule and manage group fitness classes', enabled: true },
    { id: '2', name: 'Personal Training', description: 'Book and manage 1-on-1 training sessions', enabled: true },
    { id: '3', name: 'Membership Management', description: 'Handle member subscriptions and payments', enabled: true },
    { id: '4', name: 'Equipment Booking', description: 'Reserve specific equipment or spaces', enabled: false },
    { id: '5', name: 'Nutrition Plans', description: 'Create and assign nutrition programs', enabled: false },
    { id: '6', name: 'Progress Tracking', description: 'Track member fitness progress and goals', enabled: true },
    { id: '7', name: 'Retail/Shop', description: 'Sell merchandise and supplements', enabled: false },
    { id: '8', name: 'Access Control', description: 'Manage door access and check-ins', enabled: true },
  ]);

  const handleSaveOpeningHours = () => {
    // TODO: Save to Firestore
    toast.success('Opening hours saved');
  };

  const handleAddSpace = () => {
    const newSpace: GymSpace = {
      id: Date.now().toString(),
      name: 'New Space',
      capacity: 10,
      description: '',
    };
    setGymSpaces([...gymSpaces, newSpace]);
  };

  const handleDeleteSpace = (id: string) => {
    setGymSpaces(gymSpaces.filter(space => space.id !== id));
    toast.success('Space deleted');
  };

  const handleAddStaff = () => {
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
      email: '',
      phone: '',
    };
    setStaff([...staff, newStaff]);
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter(member => member.id !== id));
    toast.success('Staff member removed');
  };

  const handleToggleModule = (id: string) => {
    setModules(modules.map(module =>
      module.id === id ? { ...module, enabled: !module.enabled } : module
    ));
  };

  const handleSaveSettings = () => {
    // TODO: Save all settings to Firestore
    toast.success('Gym settings saved successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gym Settings</h1>
        <p className="text-gray-600">Configure your gym's operational settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('hours')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hours'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Clock className="inline-block mr-2" size={18} />
            Opening Hours
          </button>
          <button
            onClick={() => setActiveTab('spaces')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'spaces'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="inline-block mr-2" size={18} />
            Gym Spaces
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'staff'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="inline-block mr-2" size={18} />
            Staff Management
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'modules'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="inline-block mr-2" size={18} />
            Software Modules
          </button>
        </nav>
      </div>

      {/* Opening Hours Tab */}
      {activeTab === 'hours' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
          <div className="space-y-4">
            {openingHours.map((day, index) => (
              <div key={day.day} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-32 font-medium">{day.day}</div>
                <input
                  type="checkbox"
                  checked={day.isOpen}
                  onChange={(e) => {
                    const newHours = [...openingHours];
                    newHours[index].isOpen = e.target.checked;
                    setOpeningHours(newHours);
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600 mr-4">Open</span>
                {day.isOpen && (
                  <>
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => {
                        const newHours = [...openingHours];
                        newHours[index].openTime = e.target.value;
                        setOpeningHours(newHours);
                      }}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                    <span className="text-gray-600">to</span>
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => {
                        const newHours = [...openingHours];
                        newHours[index].closeTime = e.target.value;
                        setOpeningHours(newHours);
                      }}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                  </>
                )}
                {!day.isOpen && <span className="text-gray-500 italic">Closed</span>}
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveOpeningHours}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            <Save size={18} className="mr-2" />
            Save Opening Hours
          </button>
        </div>
      )}

      {/* Gym Spaces Tab */}
      {activeTab === 'spaces' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gym Spaces</h2>
            <button
              onClick={handleAddSpace}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Space
            </button>
          </div>
          <div className="space-y-4">
            {gymSpaces.map((space) => (
              <div key={space.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Space Name</label>
                    <input
                      type="text"
                      value={space.name}
                      onChange={(e) => {
                        setGymSpaces(gymSpaces.map(s =>
                          s.id === space.id ? { ...s, name: e.target.value } : s
                        ));
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      value={space.capacity}
                      onChange={(e) => {
                        setGymSpaces(gymSpaces.map(s =>
                          s.id === space.id ? { ...s, capacity: parseInt(e.target.value) || 0 } : s
                        ));
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => handleDeleteSpace(space.id)}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center"
                    >
                      <Trash2 size={18} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={space.description}
                    onChange={(e) => {
                      setGymSpaces(gymSpaces.map(s =>
                        s.id === space.id ? { ...s, description: e.target.value } : s
                      ));
                    }}
                    rows={2}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Management Tab */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Staff Management</h2>
            <button
              onClick={handleAddStaff}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Staff Member
            </button>
          </div>
          <div className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        setStaff(staff.map(s =>
                          s.id === member.id ? { ...s, name: e.target.value } : s
                        ));
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => {
                        setStaff(staff.map(s =>
                          s.id === member.id ? { ...s, role: e.target.value } : s
                        ));
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => {
                        setStaff(staff.map(s =>
                          s.id === member.id ? { ...s, email: e.target.value } : s
                        ));
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={member.phone}
                      onChange={(e) => {
                        setStaff(staff.map(s =>
                          s.id === member.id ? { ...s, phone: e.target.value } : s
                        ));
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteStaff(member.id)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                >
                  <Trash2 size={18} className="mr-2" />
                  Remove Staff Member
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Software Modules Tab */}
      {activeTab === 'modules' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Software Modules</h2>
          <p className="text-gray-600 mb-6">Select which features your gym needs. Enabled modules will be available to your staff and members.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  module.enabled
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleToggleModule(module.id)}
              >
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={module.enabled}
                    onChange={() => handleToggleModule(module.id)}
                    className="mt-1 mr-3"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{module.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    {module.enabled && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save All Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 flex items-center text-lg font-semibold"
        >
          <Save size={20} className="mr-2" />
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default GymSettingsPage;
