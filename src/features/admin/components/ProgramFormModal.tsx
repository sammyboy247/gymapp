import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Program } from '@/types';
import { programService } from '@/services/firebase/programService';

const programSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['strength', 'cardio', 'hybrid', 'flexibility', 'other']),
  durationWeeks: z.number().min(1),
  exercises: z.array(z.string()).min(1),
  isActive: z.boolean(),
});

interface Props {
  program?: Program | null;
  onClose: () => void;
  onSave: (program: Program) => void;
}

export const ProgramFormModal: React.FC<Props> = ({
  program,
  onClose,
  onSave,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Program>({
    resolver: zodResolver(programSchema),
    defaultValues: program || {
      name: '',
      description: '',
      type: 'strength',
      durationWeeks: 4,
      exercises: [],
      isActive: true,
    },
  });

  useEffect(() => {
    reset(
      program || {
        name: '',
        description: '',
        type: 'strength',
        durationWeeks: 4,
        exercises: [],
        isActive: true,
      }
    );
  }, [program, reset]);

  const onSubmit = async (data: Program) => {
    try {
      if (program) {
        await programService.updateProgram(program.id, data);
        toast.success('Program updated successfully');
        onSave({ ...data, id: program.id });
      } else {
        const newProgramId = await programService.createProgram(data);
        toast.success('Program created successfully');
        onSave({ ...data, id: newProgramId });
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save program');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          {program ? 'Edit Program' : 'Create Program'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <input {...field} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <textarea {...field} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select {...field} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="other">Other</option>
                </select>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Duration (Weeks)</label>
            <Controller
              name="durationWeeks"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  type="number"
                  {...field}
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : 0)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              )}
            />
            {errors.durationWeeks && <p className="text-red-500 text-xs mt-1">{errors.durationWeeks.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Exercises (comma-separated)</label>
            <Controller
              name="exercises"
              control={control}
              render={({ field }) => <input {...field} onChange={e => field.onChange(e.target.value.split(','))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />}
            />
            {errors.exercises && <p className="text-red-500 text-xs mt-1">{errors.exercises.message}</p>}
          </div>
          <div className="flex items-center mb-4">
            <Controller
              name="isActive"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <input
                  type="checkbox"
                  {...field}
                  checked={value}
                  onChange={onChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              )}
            />
            <label className="ml-2 block text-sm text-gray-900">Active</label>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {program ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
