"use client";

import React, { useState } from "react";
import { useSizeContextNew } from "@/context/SizeContextNew";

export default function SizeContentNew() {
  const { groupedData, loading } = useSizeContextNew();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [setIsAddModalOpen] = useState(false);
  const [setEditingRow] = useState<any>(null);

  const toggleAccordion = (color_name: string) => {
    setExpanded(expanded === color_name ? null : color_name);
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsAddModalOpen(true)}
        >
          Tambah Size
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-2">
          {groupedData.map((group) => (
            <div key={group.color_name} className="border rounded">
              <div
                className="flex justify-between items-center p-2 bg-gray-100 cursor-pointer"
                onClick={() => toggleAccordion(group.color_name)}
              >
                <span>{group.color_name}</span>
                <span>{expanded === group.color_name ? "-" : "+"}</span>
              </div>

              {expanded === group.color_name && (
                <div className="p-2">
                  {group.sizes.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b py-1"
                    >
                      <span>{item.size}</span>
                      <div className="space-x-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => setEditingRow(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => {}}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* <AddSizeModalNew
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      /> */}

      {/* {editingRow && (
        <EditSizeModalNew
          isOpen={!!editingRow}
          onClose={() => setEditingRow(null)}
          id={editingRow.id}
          defaultSize={editingRow.size}
          defaultColorId={editingRow.color_id}
        />
      )} */}
    </div>
  );
}
