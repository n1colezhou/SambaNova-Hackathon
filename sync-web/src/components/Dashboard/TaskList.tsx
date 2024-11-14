import React from 'react';
import { TimelineItem, TimeBlock } from './index';

interface TimelineTableProps {
  blocks: TimeBlock[];
  onUpdateItem: (updatedItem: TimelineItem) => void;
}

export function TaskList({ blocks, onUpdateItem }: TimelineTableProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCheckboxChange = (item: TimelineItem) => {
    const updatedStatus: TimelineItem['status'] =
      item.status === 'completed' ? 'not-started' : 'completed';

    const updatedItem: TimelineItem = {
      ...item,
      status: updatedStatus,
    };

    onUpdateItem(updatedItem);
  };

  return (
    <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold mb-8">Task List</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-gray-700 bg-gray-100 rounded-tl-lg">Event</th>
            <th className="px-6 py-4 text-left font-semibold text-gray-700 bg-gray-100">Date</th>
            <th className="px-6 py-4 text-center font-semibold text-gray-700 bg-gray-100 rounded-tr-lg">Completed</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block) =>
            block.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.title}</td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{formatDate(item.date)}</td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={item.status === 'completed'}
                    onChange={() => handleCheckboxChange(item)}
                    className="form-checkbox h-6 w-6 text-blue-600 transition duration-150 ease-in-out"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}