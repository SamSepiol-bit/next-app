// components/Profile/Experiences.tsx
"use client";

import { Briefcase, Calendar, MapPin } from 'lucide-react';

interface Experience {
  id: number;
  position: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

interface ExperiencesProps {
  experiences: Experience[];
}

export default function Experiences({ experiences }: ExperiencesProps) {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Work Experience</h2>
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No work experience added yet</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Add Experience
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
          Add Experience
        </button>
      </div>
      
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 rounded-r-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{exp.position}</h3>
                <p className="text-gray-700 font-medium">{exp.company}</p>
                
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(exp.start_date).toLocaleDateString()} -{' '}
                      {exp.end_date 
                        ? new Date(exp.end_date).toLocaleDateString()
                        : 'Present'
                      }
                    </span>
                  </div>
                  
                  {exp.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                </div>
                
                {exp.description && (
                  <p className="mt-3 text-gray-600">{exp.description}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                  Edit
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}