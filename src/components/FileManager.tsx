import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  content?: string;
  children?: FileItem[];
}

interface FileManagerProps {
  serverId: string;
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'server.properties', type: 'file', size: '2.4 KB', modified: '2 hours ago', content: 'server-port=25565\nmax-players=20\ndifficulty=normal\nmotd=Welcome to my server!' },
  { 
    id: '2', 
    name: 'plugins', 
    type: 'folder', 
    modified: '1 day ago',
    children: [
      { id: '2-1', name: 'Essentials.jar', type: 'file', size: '512 KB', modified: '1 day ago' },
      { id: '2-2', name: 'WorldEdit.jar', type: 'file', size: '1.2 MB', modified: '3 days ago' },
      { id: '2-3', name: 'Vault.jar', type: 'file', size: '256 KB', modified: '1 week ago' },
    ]
  },
  { 
    id: '3', 
    name: 'world', 
    type: 'folder', 
    modified: '3 hours ago',
    children: [
      { id: '3-1', name: 'level.dat', type: 'file', size: '4.2 KB', modified: '3 hours ago' },
      { id: '3-2', name: 'region', type: 'folder', modified: '3 hours ago', children: [] },
      { id: '3-3', name: 'playerdata', type: 'folder', modified: '1 hour ago', children: [] },
    ]
  },
  { id: '4', name: 'config.yml', type: 'file', size: '1.2 KB', modified: '5 hours ago', content: 'version: 1.0\nserver-name: My Server\nauto-save: true\nbackup-interval: 3600' },
  { id: '5', name: 'whitelist.json', type: 'file', size: '0.5 KB', modified: '1 day ago', content: '[\n  {"uuid": "550e8400-e29b-41d4-a716-446655440000", "name": "Steve"},\n  {"uuid": "6fa459ea-ee8a-3ca4-894e-db77e160355e", "name": "Alex"}\n]' },
  { 
    id: '6', 
    name: 'logs', 
    type: 'folder', 
    modified: '30 min ago',
    children: [
      { id: '6-1', name: 'latest.log', type: 'file', size: '124 KB', modified: '5 min ago' },
      { id: '6-2', name: '2024-12-01.log.gz', type: 'file', size: '45 KB', modified: '1 day ago' },
    ]
  },
  {
    id: '7',
    name: 'backups',
    type: 'folder',
    modified: '1 hour ago',
    children: [
      { id: '7-1', name: 'backup_2024-12-02.zip', type: 'file', size: '256 MB', modified: '1 hour ago' },
      { id: '7-2', name: 'backup_2024-12-01.zip', type: 'file', size: '248 MB', modified: '1 day ago' },
    ]
  },
];

const FileManager = ({ serverId }: FileManagerProps) => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);


  const handleDelete = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const handleEdit = (file: FileItem) => {
    setSelectedFile(file);
    setEditContent(file.content || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedFile) {
      setFiles(files.map(f => 
        f.id === selectedFile.id ? { ...f, content: editContent } : f
      ));
      setIsEditing(false);
      setSelectedFile(null);
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile: FileItem = {
        id: String(Date.now()),
        name: file.name,
        type: 'file',
        size: formatFileSize(file.size),
        modified: 'Just now',
        content: e.target?.result as string
      };

      const currentFiles = getCurrentFiles();
      if (currentPath.length === 0) {
        setFiles([...files, newFile]);
      } else {
        const updatedFiles = addFileToPath(files, currentPath, newFile);
        setFiles(updatedFiles);
      }
    };
    reader.readAsText(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getCurrentFiles = (): FileItem[] => {
    let current = files;
    for (const folder of currentPath) {
      const found = current.find(f => f.name === folder);
      if (found && found.children) {
        current = found.children;
      }
    }
    return current;
  };

  const addFileToPath = (fileList: FileItem[], path: string[], newFile: FileItem): FileItem[] => {
    if (path.length === 0) {
      return [...fileList, newFile];
    }
    return fileList.map(item => {
      if (item.name === path[0] && item.type === 'folder') {
        return {
          ...item,
          children: path.length === 1 
            ? [...(item.children || []), newFile]
            : addFileToPath(item.children || [], path.slice(1), newFile)
        };
      }
      return item;
    });
  };

  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const handleDownload = (file: FileItem) => {
    const blob = new Blob([file.content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const displayFiles = getCurrentFiles();

  return (
    <Card className="bg-card border-border">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Folder" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">File Manager</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              onChange={handleUpload}
              className="hidden"
              id="file-upload"
            />
            <Button size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
              <Icon name="Upload" size={16} className="mr-2" />
              Upload
            </Button>
            <Button size="sm" variant="outline">
              <Icon name="FolderPlus" size={16} className="mr-2" />
              New Folder
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          {currentPath.length > 0 && (
            <Button size="sm" variant="outline" onClick={navigateBack}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back
            </Button>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Home" size={16} />
            <span>/</span>
            {currentPath.map((folder, index) => (
              <span key={index} className="flex items-center gap-2">
                <span className="text-foreground font-medium">{folder}</span>
                {index < currentPath.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <Input placeholder="Search files..." className="max-w-md" />
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {displayFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-all bg-muted/20"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon
                    name={file.type === 'folder' ? 'Folder' : 'FileText'}
                    size={20}
                    className={file.type === 'folder' ? 'text-warning' : 'text-accent'}
                  />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.size && `${file.size} • `}{file.modified}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {file.type === 'folder' ? (
                    <Button size="sm" variant="outline" onClick={() => navigateToFolder(file.name)}>
                      <Icon name="FolderOpen" size={16} />
                    </Button>
                  ) : (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedFile(file)}>
                            <Icon name="Eye" size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Icon name="FileText" size={20} className="text-accent" />
                              {file.name}
                            </DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="h-[400px] w-full rounded-md border border-border p-4 bg-black/40">
                            <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">
                              {file.content || 'File is empty'}
                            </pre>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isEditing && selectedFile?.id === file.id} onOpenChange={setIsEditing}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(file)}>
                            <Icon name="Edit" size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Icon name="Edit" size={20} className="text-primary" />
                              Edit {file.name}
                            </DialogTitle>
                          </DialogHeader>
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[400px] font-mono"
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSave}>
                              <Icon name="Save" size={16} className="mr-2" />
                              Save
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

                  {file.type === 'file' && (
                    <Button size="sm" variant="outline" onClick={() => handleDownload(file)}>
                      <Icon name="Download" size={16} />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default FileManager;