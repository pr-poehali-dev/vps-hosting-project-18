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
}

interface FileManagerProps {
  serverId: string;
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'server.properties', type: 'file', size: '2.4 KB', modified: '2 hours ago', content: 'server-port=25565\nmax-players=20\ndifficulty=normal' },
  { id: '2', name: 'plugins', type: 'folder', modified: '1 day ago' },
  { id: '3', name: 'world', type: 'folder', modified: '3 hours ago' },
  { id: '4', name: 'config.yml', type: 'file', size: '1.2 KB', modified: '5 hours ago', content: 'version: 1.0\nserver-name: My Server\nauto-save: true' },
  { id: '5', name: 'whitelist.json', type: 'file', size: '0.5 KB', modified: '1 day ago', content: '[\n  {"uuid": "123", "name": "Steve"}\n]' },
  { id: '6', name: 'logs', type: 'folder', modified: '30 min ago' },
];

const FileManager = ({ serverId }: FileManagerProps) => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
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

  const handleUpload = () => {
    const newFile: FileItem = {
      id: String(Date.now()),
      name: 'newfile.txt',
      type: 'file',
      size: '0 KB',
      modified: 'Just now',
      content: ''
    };
    setFiles([...files, newFile]);
  };

  return (
    <Card className="bg-card border-border">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Folder" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">File Manager</h3>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUpload}>
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
        <div className="mb-4">
          <Input placeholder="Search files..." className="max-w-md" />
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {files.map((file) => (
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
                  {file.type === 'file' && (
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

                  <Button size="sm" variant="outline">
                    <Icon name="Download" size={16} />
                  </Button>

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
