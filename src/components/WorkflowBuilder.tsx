import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCheck, 
  Building, 
  Crown, 
  Clock, 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Timer,
  AlertTriangle
} from "lucide-react";

// Custom Node Components
const RoleNode = ({ data }: { data: any }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Principal': return <Crown className="h-4 w-4" />;
      case 'Registrar': return <UserCheck className="h-4 w-4" />;
      case 'HOD': return <Building className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Principal': return 'bg-green-100 border-green-500 text-green-800';
      case 'Registrar': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'HOD': return 'bg-purple-100 border-purple-500 text-purple-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className={`px-4 py-2 rounded-lg border-2 min-w-[120px] ${getRoleColor(data.role)}`}>
      <div className="flex items-center gap-2">
        {getRoleIcon(data.role)}
        <span className="font-medium text-sm">{data.role}</span>
      </div>
      <div className="text-xs mt-1">{data.label}</div>
    </div>
  );
};

const DecisionNode = ({ data }: { data: any }) => (
  <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg px-3 py-2 min-w-[100px]">
    <div className="flex items-center gap-2 text-yellow-800">
      <GitBranch className="h-4 w-4" />
      <span className="font-medium text-sm">Decision</span>
    </div>
    <div className="text-xs mt-1 text-yellow-700">{data.label}</div>
  </div>
);

const StatusNode = ({ data }: { data: any }) => {
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'approved': return { icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 border-green-500 text-green-800', label: 'Approved' };
      case 'rejected': return { icon: <XCircle className="h-4 w-4" />, color: 'bg-red-100 border-red-500 text-red-800', label: 'Rejected' };
      case 'pending': return { icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-100 border-yellow-500 text-yellow-800', label: 'Pending' };
      case 'draft': return { icon: <Timer className="h-4 w-4" />, color: 'bg-gray-100 border-gray-500 text-gray-800', label: 'Draft' };
      default: return { icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-gray-100 border-gray-500 text-gray-800', label: 'Unknown' };
    }
  };

  const statusDisplay = getStatusDisplay(data.status);

  return (
    <div className={`px-3 py-2 rounded-lg border-2 min-w-[100px] ${statusDisplay.color}`}>
      <div className="flex items-center gap-2">
        {statusDisplay.icon}
        <span className="font-medium text-sm">{statusDisplay.label}</span>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  roleNode: RoleNode,
  decisionNode: DecisionNode,
  statusNode: StatusNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'roleNode',
    position: { x: 250, y: 25 },
    data: { role: 'Principal', label: 'Start Approval' },
  },
  {
    id: '2',
    type: 'decisionNode',
    position: { x: 200, y: 125 },
    data: { label: 'Review Required?' },
  },
  {
    id: '3',
    type: 'roleNode',
    position: { x: 100, y: 225 },
    data: { role: 'Registrar', label: 'Detailed Review' },
  },
  {
    id: '4',
    type: 'roleNode',
    position: { x: 300, y: 225 },
    data: { role: 'HOD', label: 'Department Check' },
  },
  {
    id: '5',
    type: 'statusNode',
    position: { x: 200, y: 325 },
    data: { status: 'approved' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    label: 'Yes',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    type: 'smoothstep',
    label: 'Escalate',
    style: { strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: string, nodeData: any) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: nodeData,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const nodeLibrary = [
    { type: 'roleNode', data: { role: 'Principal', label: 'Principal Review' }, icon: Crown, color: 'bg-green-100' },
    { type: 'roleNode', data: { role: 'Registrar', label: 'Registrar Check' }, icon: UserCheck, color: 'bg-blue-100' },
    { type: 'roleNode', data: { role: 'HOD', label: 'HOD Approval' }, icon: Building, color: 'bg-purple-100' },
    { type: 'decisionNode', data: { label: 'Decision Point' }, icon: GitBranch, color: 'bg-yellow-100' },
    { type: 'statusNode', data: { status: 'approved' }, icon: CheckCircle, color: 'bg-green-100' },
    { type: 'statusNode', data: { status: 'rejected' }, icon: XCircle, color: 'bg-red-100' },
    { type: 'statusNode', data: { status: 'pending' }, icon: Clock, color: 'bg-yellow-100' },
    { type: 'statusNode', data: { status: 'draft' }, icon: Timer, color: 'bg-gray-100' },
  ];

  return (
    <div className="flex h-[600px] gap-4">
      {/* Node Library */}
      <div className="w-64 bg-background border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Node Library</h3>
          <p className="text-sm text-muted-foreground">Drag nodes to canvas</p>
        </div>
        <div className="p-4 space-y-2">
          {nodeLibrary.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className={`w-full justify-start gap-2 h-auto p-3 ${item.color}`}
                onClick={() => addNode(item.type, item.data)}
              >
                <IconComponent className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">
                    {item.data.role || item.data.status || 'Decision'}
                  </div>
                  <div className="text-xs opacity-75">
                    {item.data.label || 'Logic Node'}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 border rounded-lg bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={{ backgroundColor: 'hsl(var(--background))' }}
        >
          <Controls />
          <MiniMap 
            zoomable 
            pannable 
            style={{ backgroundColor: 'hsl(var(--muted))' }}
          />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Properties Panel */}
      <div className="w-64 bg-background border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Properties</h3>
          <p className="text-sm text-muted-foreground">Configure selected node</p>
        </div>
        <div className="p-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Node ID</label>
                <p className="text-sm text-muted-foreground">{selectedNode}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Edge Styles</label>
                <div className="space-y-2 mt-2">
                  <Badge variant="outline">→ Normal Flow</Badge>
                  <Badge variant="outline">⟶ Decision Branch</Badge>
                  <Badge variant="outline">⤏ Escalation</Badge>
                  <Badge variant="outline">↺ Loop Back</Badge>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a node to view properties</p>
          )}
        </div>
      </div>
    </div>
  );
};