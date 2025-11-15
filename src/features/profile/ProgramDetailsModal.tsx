import React, { useState, useEffect } from 'react';
import { programService } from '@/services/firebase/programService';
import type { Program, ProgramAssignment } from '@/types';

interface ProgramDetailsModalProps {
  program: ProgramAssignment;
  onClose: () => void;
}

export const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({ program, onClose }) => {
  const [programDetails, setProgramDetails] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await programService.getProgram(program.programId);
        setProgramDetails(details);
      } catch (err) {
        setError('Failed to load program details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgramDetails();
  }, [program]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">Program Details</h2>
        {loading ? (
          <p>Loading details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : programDetails ? (
          <div>
            <p>
              <strong>Name:</strong> {programDetails.name}
            </p>
            <p>
              <strong>Description:</strong> {programDetails.description}
            </p>
          </div>
        ) : (
          <p>Program details not found.</p>
        )}
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};
