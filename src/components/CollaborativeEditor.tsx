
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { User, Operation, EditorMessage, DocumentVersion } from '@/types/editor';
import { useWebSocket } from '@/hooks/useWebSocket';
import { OperationalTransform } from '@/utils/operationalTransform';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Users, Save, History, Wifi, WifiOff } from 'lucide-react';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];

const CollaborativeEditor = () => {
  const [content, setContent] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [pendingOperations, setPendingOperations] = useState<Operation[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastContentRef = useRef('');
  const userIdRef = useRef<string>('');

  // Mock WebSocket URL - in production, this would be your WebSocket server
  const WS_URL = 'wss://echo.websocket.org';

  const handleWebSocketMessage = useCallback((message: EditorMessage) => {
    console.log('Received message:', message);

    switch (message.type) {
      case 'operation':
        if (message.operation && message.userId !== userIdRef.current) {
          const transformedOps = OperationalTransform.transform(message.operation, message.operation);
          let newContent = content;
          transformedOps.forEach(op => {
            newContent = OperationalTransform.applyOperation(newContent, op);
          });
          setContent(newContent);
          lastContentRef.current = newContent;
        }
        break;

      case 'cursor':
        setUsers(prev => prev.map(user => 
          user.id === message.userId 
            ? { ...user, cursor: message.cursor }
            : user
        ));
        break;

      case 'user-join':
        if (message.user && message.user.id !== userIdRef.current) {
          setUsers(prev => [...prev.filter(u => u.id !== message.user!.id), message.user!]);
        }
        break;

      case 'user-leave':
        setUsers(prev => prev.filter(user => user.id !== message.userId));
        break;

      case 'document-state':
        if (message.document) {
          setContent(message.document.content);
          setVersions(prev => [...prev, message.document!]);
          setCurrentVersion(message.document.version);
          lastContentRef.current = message.document.content;
        }
        break;
    }
  }, [content]);

  const { isConnected, connectionStatus, sendMessage } = useWebSocket({
    url: WS_URL,
    onMessage: handleWebSocketMessage,
    onConnect: () => {
      if (currentUser) {
        sendMessage({
          type: 'user-join',
          userId: currentUser.id,
          user: currentUser
        });
      }
    }
  });

  const joinSession = () => {
    if (!userName.trim()) return;

    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const user: User = {
      id: userId,
      name: userName,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };

    setCurrentUser(user);
    setIsJoined(true);
    userIdRef.current = userId;

    if (isConnected) {
      sendMessage({
        type: 'user-join',
        userId: user.id,
        user
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const oldContent = lastContentRef.current;
    
    if (newContent === oldContent) return;

    setContent(newContent);
    lastContentRef.current = newContent;

    // Create operation based on text difference
    let operation: Operation;
    
    if (newContent.length > oldContent.length) {
      // Insert operation
      const insertPos = findInsertPosition(oldContent, newContent);
      const insertedText = newContent.slice(insertPos, insertPos + (newContent.length - oldContent.length));
      
      operation = {
        type: 'insert',
        position: insertPos,
        content: insertedText,
        userId: userIdRef.current,
        timestamp: Date.now()
      };
    } else {
      // Delete operation
      const deletePos = findDeletePosition(oldContent, newContent);
      const deleteLength = oldContent.length - newContent.length;
      
      operation = {
        type: 'delete',
        position: deletePos,
        length: deleteLength,
        userId: userIdRef.current,
        timestamp: Date.now()
      };
    }

    // Send operation to other users
    if (isConnected && currentUser) {
      sendMessage({
        type: 'operation',
        userId: currentUser.id,
        operation
      });
    }

    // Store pending operation for conflict resolution
    setPendingOperations(prev => [...prev, operation]);
  };

  const handleCursorChange = () => {
    if (textareaRef.current && currentUser && isConnected) {
      const cursorPosition = textareaRef.current.selectionStart;
      sendMessage({
        type: 'cursor',
        userId: currentUser.id,
        cursor: cursorPosition
      });
    }
  };

  const saveDocument = async () => {
    const version: DocumentVersion = {
      id: `v${currentVersion + 1}-${Date.now()}`,
      content,
      operations: pendingOperations,
      timestamp: Date.now(),
      version: currentVersion + 1
    };

    setVersions(prev => [...prev, version]);
    setCurrentVersion(prev => prev + 1);
    setPendingOperations([]);

    // In a real app, you'd save to a backend here
    console.log('Document saved:', version);
  };

  const findInsertPosition = (oldText: string, newText: string): number => {
    for (let i = 0; i < Math.min(oldText.length, newText.length); i++) {
      if (oldText[i] !== newText[i]) {
        return i;
      }
    }
    return oldText.length;
  };

  const findDeletePosition = (oldText: string, newText: string): number => {
    for (let i = 0; i < Math.min(oldText.length, newText.length); i++) {
      if (oldText[i] !== newText[i]) {
        return i;
      }
    }
    return newText.length;
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Collaborative Editor</h1>
            <p className="text-gray-600">Enter your name to join the editing session</p>
          </div>
          
          <div className="space-y-4">
            <Input
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && joinSession()}
              className="text-center"
            />
            <Button 
              onClick={joinSession} 
              disabled={!userName.trim()}
              className="w-full"
            >
              Join Session
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Collaborative Editor</h1>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Badge variant="secondary" className="text-green-600">
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={saveDocument} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save (v{currentVersion})
            </Button>
            
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{users.length + 1} users</span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="flex items-center space-x-2 mt-3">
          <Badge 
            style={{ backgroundColor: currentUser?.color + '20', color: currentUser?.color }}
            variant="outline"
          >
            {currentUser?.name} (You)
          </Badge>
          {users.map(user => (
            <Badge 
              key={user.id}
              style={{ backgroundColor: user.color + '20', color: user.color }}
              variant="outline"
            >
              {user.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6">
        <Card className="h-[calc(100vh-200px)]">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            onSelect={handleCursorChange}
            placeholder="Start typing to collaborate in real-time..."
            className="w-full h-full resize-none border-0 focus:ring-0 text-base leading-relaxed"
          />
        </Card>

        {/* Version History */}
        {versions.length > 0 && (
          <Card className="mt-4 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <History className="w-4 h-4 text-gray-500" />
              <h3 className="font-medium text-gray-700">Version History</h3>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {versions.slice(-5).reverse().map(version => (
                <div key={version.id} className="text-sm text-gray-600 flex justify-between">
                  <span>Version {version.version}</span>
                  <span>{new Date(version.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CollaborativeEditor;
