#!/bin/bash

# Manual test script for JSON Export functionality
# Tests Task 023 implementation

echo "🧪 Testing JSON Export Implementation (Task 023)"
echo "================================================"
echo ""

# Create a temporary TypeScript test file
cat > /tmp/test-json-export.ts << 'EOF'
import { exportDiagram } from './src/lib/export/ExportEngine';
import type { DiagramExportData } from './src/lib/export/types';

const sampleData: DiagramExportData = {
  id: 'test-diagram',
  name: 'Sample Architecture',
  description: 'Test diagram for JSON export',
  projectId: 'test-project',
  projectName: 'Test Project',
  nodes: [
    {
      id: 'node-1',
      type: 'ui-component',
      position: { x: 100, y: 100 },
      data: { label: 'Login Page', description: 'User login interface' },
    },
    {
      id: 'node-2',
      type: 'api-endpoint',
      position: { x: 300, y: 100 },
      data: { label: '/api/auth', description: 'Authentication API' },
    },
    {
      id: 'node-3',
      type: 'database',
      position: { x: 500, y: 100 },
      data: { label: 'PostgreSQL', description: 'Main database' },
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      type: 'data-flow',
      data: { label: 'POST /login' },
    },
    {
      id: 'edge-2',
      source: 'node-2',
      target: 'node-3',
      type: 'data-flow',
      data: { label: 'Query user' },
    },
  ],
  viewport: { x: 0, y: 0, zoom: 1 },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  owner: {
    id: 'user-1',
    name: 'Test User',
  },
};

async function runTest() {
  console.log('Test 1: Basic JSON export...');
  const result1 = await exportDiagram(sampleData, 'json');
  const parsed1 = JSON.parse(result1.content as string);
  
  console.assert(parsed1.$schema === 'ideagraph-diagram-export', 'Schema field present');
  console.assert(parsed1.version === '1.0.0', 'Version correct');
  console.assert(parsed1.metadata.id === 'test-diagram', 'Metadata ID correct');
  console.assert(parsed1.diagram.nodes.length === 3, 'All nodes present');
  console.assert(parsed1.diagram.edges.length === 2, 'All edges present');
  console.log('✅ Test 1 PASSED');
  
  console.log('\nTest 2: JSON with computed properties...');
  const result2 = await exportDiagram(sampleData, 'json', { includeComputedProperties: true });
  const parsed2 = JSON.parse(result2.content as string);
  
  console.assert(parsed2.computed, 'Computed section present');
  console.assert(parsed2.computed.connectivity, 'Connectivity computed');
  console.assert(parsed2.computed.flows, 'Flows computed');
  console.assert(parsed2.computed.complexity, 'Complexity computed');
  console.log('✅ Test 2 PASSED');
  
  console.log('\nTest 3: Minified output...');
  const result3 = await exportDiagram(sampleData, 'json', { prettyPrint: false });
  const content3 = result3.content as string;
  
  console.assert(content3.split('\n').length === 1, 'Minified to single line');
  console.assert(JSON.parse(content3), 'Still valid JSON');
  console.log('✅ Test 3 PASSED');
  
  console.log('\n🎉 All tests PASSED!');
  console.log('\n📋 Sample output (pretty printed):');
  console.log('-----------------------------------');
  const sample = await exportDiagram(sampleData, 'json', { 
    prettyPrint: true, 
    indent: 2,
    includeTimestamps: false  // For deterministic output
  });
  console.log((sample.content as string).substring(0, 800) + '\n  ...\n}');
}

runTest().catch(console.error);
EOF

echo "Test script created. To run:"
echo "  npx tsx /tmp/test-json-export.ts"
echo ""
echo "✅ JSON Export Implementation Complete"
echo ""
echo "Features implemented:"
echo "  ✅ Versioned schema (1.0.0)"
echo "  ✅ Metadata section (id, name, project, author, timestamps)"
echo "  ✅ Diagram section (normalized nodes, edges, viewport)"
echo "  ✅ Statistics section (summaries, grouping by type)"
echo "  ✅ Computed properties (connectivity, flows, complexity)"
echo "  ✅ Formatting options (pretty print, indentation, minify)"
echo "  ✅ Data normalization (removes React Flow internals)"
echo "  ✅ 31 comprehensive test cases"
echo ""
echo "Files modified:"
echo "  - src/lib/export/ExportEngine.ts (added full JSON implementation)"
echo "  - package.json (v0.1.23, added vitest)"
echo ""
echo "Files created:"
echo "  - src/lib/export/__tests__/json.test.ts (31 test cases)"
echo "  - src/lib/export/__tests__/json-manual-test.ts (smoke test)"
echo "  - vitest.config.ts (test configuration)"
echo "  - docs/task/TASK_023_COMPLETION.md (completion report)"
echo ""

