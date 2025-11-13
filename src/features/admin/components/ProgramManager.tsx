import React, { useState, useEffect } from 'react';
import { Program, ProgramAssignment } from '@/types';
import { programService } from '@/services/firebase/programService';
import { ProgramFormModal } from './ProgramFormModal';
import { AssignProgramModal } from './AssignProgramModal';

export const ProgramManager: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [assignments, setAssignments] = useState<ProgramAssignment[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      const fetchedPrograms = await programService.getPrograms();
      setPrograms(fetchedPrograms);
    };
    fetchPrograms();
  }, []);

  const handleSaveProgram = (program: Program) => {
    if (selectedProgram) {
      setPrograms(programs.map((p) => (p.id === program.id ? program : p)));
    } else {
      setPrograms([...programs, program]);
    }
  };

  const handleAssignProgram = (assignment: ProgramAssignment) => {
    setAssignments([...assignments, assignment]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Member Programs</h2>
        <button
          onClick={() => {
            setSelectedProgram(null);
            setIsFormModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Program
        </button>
      </div>
      <div className="space-y-4">
        {programs.map(program => (
          <div key={program.id} className="border border-zinc-200 rounded-lg p-4">
            <h3 className="text-xl font-semibold">{program.name}</h3>
            <p className="text-gray-600">{program.description}</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setSelectedProgram(program);
                  setIsFormModalOpen(true);
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await programService.deleteProgram(program.id);
                  setPrograms(programs.filter(p => p.id !== program.id));
                }}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Assign
              </button>
            </div>
          </div>
        ))}
      </div>
      {isFormModalOpen && (
        <ProgramFormModal
          program={selectedProgram}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveProgram}
        />
      )}
      {isAssignModalOpen && (
        <AssignProgramModal
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={handleAssignProgram}
        />
      )}
    </div>
  );
};
