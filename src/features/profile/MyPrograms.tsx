import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/firebase/userService';
import { programService } from '@/services/firebase/programService';
import type { ProgramAssignment } from '@/types';
import { ProgramDetailsModal } from './ProgramDetailsModal';

interface ProgramAssignmentWithDetails extends ProgramAssignment {
  programName?: string;
}

export const MyPrograms: React.FC = () => {
  const { user } = useAuthStore();
  const [programs, setPrograms] = useState<ProgramAssignmentWithDetails[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<ProgramAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (user?.uid) {
        try {
          setLoading(true);
          setError(null);
          const userPrograms = await userService.getUserPrograms(user.uid);

          const programsWithDetails = await Promise.all(
            userPrograms.map(async (assignment) => {
              const programDetails = await programService.getProgram(assignment.programId);
              return { ...assignment, programName: programDetails?.name };
            })
          );

          setPrograms(programsWithDetails);
        } catch (err) {
          setError('Failed to load programs. Please try again later.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPrograms();
  }, [user]);

  if (loading) return <p>Loading programs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Programs</h2>
      {programs.length > 0 ? (
        <ul>
          {programs.map((program) => (
            <li
              key={program.id}
              onClick={() => setSelectedProgram(program)}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              {program.programName || program.programId}
            </li>
          ))}
        </ul>
      ) : (
        <p>No programs assigned.</p>
      )}
      {selectedProgram && (
        <ProgramDetailsModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
      )}
    </div>
  );
};
