import React from 'react';
import { Handle, Position } from '@xyflow/react';

export const ObjectNode = ({ data }: any) => {
  return (
    <div className="px-6 py-3 shadow-lg rounded-lg bg-blue-500 border-2 border-blue-700 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="text-white font-semibold text-center text-base">
        {data.label}
      </div>
      <div className="text-xs text-blue-100 text-center truncate">
        {data.path}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export const ArrayNode = ({ data }: any) => {
  return (
    <div className="px-6 py-3 shadow-lg rounded-lg bg-green-500 border-2 border-green-700 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="text-white font-semibold text-center text-base">
        {data.label}
      </div>
      <div className="text-xs text-green-100 text-center truncate">
        {data.path}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export const PrimitiveNode = ({ data }: any) => {
  return (
    <div className="px-6 py-3 shadow-lg rounded-lg bg-orange-500 border-2 border-orange-700 min-w-[200px] max-w-[300px]">
      <Handle type="target" position={Position.Top} />
      <div className="text-white font-semibold text-sm text-center break-words">
        {data.label}
      </div>
      <div className="text-xs text-orange-100 text-center truncate">
        {data.path}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
