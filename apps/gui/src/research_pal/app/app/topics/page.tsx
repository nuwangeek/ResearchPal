'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TopicList } from '@/components/topics/topic-list';
import { TopicForm } from '@/components/topics/topic-form';
import { useTopics } from '@/hooks/use-topics';
import { TopicFormData } from '@/types/topic';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function TopicsPage() {
  const { topics, isLoading, createTopic, updateTopic, deleteTopic, toggleTopic } = useTopics();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editingTopic = editingTopicId
    ? topics.find((t) => t.id === editingTopicId)
    : undefined;

  const handleCreate = async (data: TopicFormData) => {
    setIsSubmitting(true);
    try {
      await createTopic(data);
      setIsFormOpen(false);
      toast.success('Topic created successfully');
    } catch (error) {
      toast.error('Failed to create topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: TopicFormData) => {
    if (!editingTopicId) return;

    setIsSubmitting(true);
    try {
      await updateTopic(editingTopicId, data);
      setEditingTopicId(null);
      setIsFormOpen(false);
      toast.success('Topic updated successfully');
    } catch (error) {
      toast.error('Failed to update topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTopicId) return;

    try {
      await deleteTopic(deletingTopicId);
      setDeletingTopicId(null);
      toast.success('Topic deleted successfully');
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  const handleToggle = async (topicId: string, enabled: boolean) => {
    try {
      await toggleTopic(topicId, enabled);
      toast.success(enabled ? 'Topic activated' : 'Topic paused');
    } catch (error) {
      toast.error('Failed to toggle topic');
    }
  };

  const handleEdit = (topicId: string) => {
    setEditingTopicId(topicId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTopicId(null);
  };

  return (
    <>
      <TopBar
        title="Topics"
        actions={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        }
      />

      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading topics...</p>
          </div>
        ) : (
          <TopicList
            topics={topics}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={setDeletingTopicId}
          />
        )}
      </div>

      {/* Create/Edit Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={handleCloseForm}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingTopic ? 'Edit Topic' : 'Create Topic'}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <TopicForm
              topic={editingTopic}
              onSubmit={editingTopic ? handleUpdate : handleCreate}
              onCancel={handleCloseForm}
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingTopicId} onOpenChange={() => setDeletingTopicId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Topic</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this topic? All curated papers associated with
              this topic will remain but will no longer be linked to it. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingTopicId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
