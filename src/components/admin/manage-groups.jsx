import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Users, Trash2 } from 'lucide-react';
import { ContextActions } from '@/components/tables/context-actions';
import { DropdownActions } from '@/components/tables/dropdown-actions';
import { AddGroupDialog } from '@/components/dialogs/add-group-dialog';
import { EditGroupDialog } from '@/components/dialogs/edit-group-dialog';
import { AdminCardSkeleton } from '@/components/skeletons/admin-card-skeleton';
import { toast } from 'sonner';
import { useGroups } from '@/contexts/groups-context';

export function ManageGroups() {
  const { groups, loading: groupsLoading } = useGroups();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const filteredGroups = groups?.filter((group) => {
    return group.name?.toLowerCase().includes(search.toLowerCase());
  });

  const handleEditClick = (group) => {
    setSelectedGroup(group);
    setEditOpen(true);
  };

  const handleDeleteGroup = (props, groupId) => {
    return (
      <DeleteDialog
        triggerText='Delete Group'
        deleteAction={() => {
          return toast.promise(console.log('Deleting group:', groupId), {
            loading: 'Deleting group...',
            success: () => {
              props.onSuccess?.(true);
              return 'Group deleted';
            },
            error: () => {
              props.onSuccess?.(false);
              return 'Failed to delete group';
            },
          });
        }}
        {...props}
      />
    );
  };

  const contextActions = (group) => [
    { text: 'Edit Group', icon: Edit, action: () => handleEditClick(group) },
    'seperator',
    {
      text: 'Delete Group',
      icon: Trash2,
      dialog: true,
      dialogContent: (props) => handleDeleteGroup(props, group.id),
      destructive: true,
      disabled: true,
    },
  ];

  if (groupsLoading) {
    return <AdminCardSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Manage Groups</CardTitle>
        <CardDescription>Create, update, and delete user groups.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='xs:flex-row flex flex-col items-center justify-between gap-4'>
            <Input
              placeholder='Search group name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full max-w-md flex-1'
            />
            <Button
              type='button'
              className='xs:w-auto w-full text-base'
              onClick={() => setAddOpen(true)}
            >
              <Users /> Add Group
            </Button>
          </div>

          {filteredGroups.length === 0 ? (
            <p className='text-muted-foreground italic'>No groups found.</p>
          ) : (
            <div className='overflow-hidden rounded-lg border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.map((group) => (
                    <ContextActions key={group.id} actions={contextActions(group)}>
                      <TableRow key={group.id}>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>{group.description || '-'}</TableCell>
                        <TableCell className='text-right'>
                          <DropdownActions actions={contextActions(group)} />
                        </TableCell>
                      </TableRow>
                    </ContextActions>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <EditGroupDialog open={editOpen} onOpenChange={setEditOpen} group={selectedGroup} />
          <AddGroupDialog open={addOpen} onOpenChange={setAddOpen} />
        </div>
      </CardContent>
    </Card>
  );
}
