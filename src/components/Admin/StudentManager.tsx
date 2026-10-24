import React, { useState } from 'react';
import type { Student, Course } from '../../types';
import {
  Users,
  UserPlus,
  Mail,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  BookOpen,
} from 'lucide-react';

interface StudentManagerProps {
  students: Student[];
  courses: Course[];
  onAddStudent: (name: string, email: string, courseIds: string[]) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  courses,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Student form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(() =>
    courses.map(c => c.id)
  );

  const handleToggleCourseSelect = (courseId: string) => {
    setSelectedCourseIds(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    onAddStudent(newName.trim(), newEmail.trim(), selectedCourseIds);
    setNewName('');
    setNewEmail('');
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Zona de Control del Profesor
          </span>
          <h2 className="text-2xl font-extrabold text-[#281434] tracking-tight">
            Gestión y Acceso de Alumnos ({students.length})
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Solo los alumnos registrados aquí con su correo electrónico pueden acceder a los cursos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-semibold py-2.5 px-5 rounded-full text-xs shadow-xs transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Añadir Nuevo Alumno</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar alumno por nombre o correo electrónico..."
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
      </div>

      {/* Students Table / Cards */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs space-y-2">
            <Users className="w-8 h-8 mx-auto text-stone-300" />
            <p>No se encontraron alumnos con ese criterio de búsqueda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#faf8f5] border-b border-stone-100 text-stone-600 font-semibold">
                  <th className="p-4 pl-6">Alumno</th>
                  <th className="p-4">Correo Electrónico</th>
                  <th className="p-4">Cursos Asignados</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredStudents.map(student => {
                  const assignedCount = student.enrolledCourseIds.length;

                  return (
                    <tr key={student.id} className="hover:bg-purple-50/30 transition-colors">
                      {/* Name & Avatar */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-[#724ae8] font-bold flex items-center justify-center text-xs">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block">{student.name}</span>
                            <span className="text-[11px] text-stone-400">
                              Registrado: {new Date(student.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 font-mono text-stone-700">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          <span>{student.email}</span>
                        </div>
                      </td>

                      {/* Enrolled Courses */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium bg-purple-50 text-purple-900 text-[11px]">
                          <BookOpen className="w-3 h-3 text-purple-600" />
                          {assignedCount} curso(s)
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <button
                          onClick={() => {
                            const newStatus = student.status === 'active' ? 'inactive' : 'active';
                            onUpdateStudent({ ...student, status: newStatus });
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                            student.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-500 border border-stone-200'
                          }`}
                          title="Haz clic para cambiar estado"
                        >
                          {student.status === 'active' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-stone-400" />
                              <span>Pausado</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar al alumno ${student.name} (${student.email})?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar alumno"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <h3 className="text-xl font-bold text-[#281434] mb-4">
              Registrar Nuevo Alumno
            </h3>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="p. ej. María Fernández"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600">Correo Electrónico del Alumno</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="alumno@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
                <p className="text-[11px] text-stone-400">
                  El alumno utilizará este correo exacto para ingresar en la zona de estudiantes.
                </p>
              </div>

              {/* Course Assignment */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-stone-600">Cursos con acceso permitido</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {courses.map(course => {
                    const isChecked = selectedCourseIds.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className="flex items-center gap-2 p-2 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCourseSelect(course.id)}
                          className="accent-[#724ae8] rounded"
                        />
                        <span className="font-semibold text-stone-800 truncate">{course.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#724ae8] hover:bg-[#5d38cc] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  Guardar y Autorizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
