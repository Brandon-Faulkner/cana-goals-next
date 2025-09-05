import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserPlus, UserPen, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminCardSkeleton } from '@/components/skeletons/admin-card-skeleton';
import { ContextActions } from '@/components/tables/context-actions';
import { DropdownActions } from '@/components/tables/dropdown-actions';
import { EditUserDialog } from '@/components/dialogs/edit-user-dialog';
import { AddUserDialog } from '@/components/dialogs/add-user-dialog';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { deleteUserDoc } from '@/lib/user-handlers';
import { useGroups } from '@/contexts/groups-context';
import { toast } from 'sonner';

export function ManageUsers({ isAdmin }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { groups } = useGroups();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const getGroupNames = (groupIds) => {
    return groupIds?.map((id) => groups.find((g) => g.id === id)?.name).filter(Boolean) || [];
  };

  const handleEditClick = (user) => {
    if (!isAdmin) {
      toast.error('You must be an admin to edit users.');
      return;
    }

    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleDeleteUser = (props, userId) => {
    return (
      <DeleteDialog
        triggerText='Delete User'
        deleteAction={() => {
          if (!isAdmin) {
            toast.error('You must be an admin to delete users.');
            props.onSuccess?.(false);
            return null;
          }
          return toast.promise(deleteUserDoc(userId), {
            loading: 'Deleting user...',
            success: () => {
              props.onSuccess?.(true);
              return 'User deleted';
            },
            error: () => {
              props.onSuccess?.(false);
              return 'Failed to delete user';
            },
          });
        }}
        {...props}
      />
    );
  };

  const contextActions = (user) => [
    { text: 'Edit User', icon: UserPen, action: () => handleEditClick(user) },
    'seperator',
    {
      text: 'Delete User',
      icon: Trash2,
      dialog: true,
      dialogContent: (props) => handleDeleteUser(props, user.id),
      destructive: true,
    },
  ];

  if (loading) {
    return <AdminCardSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Manage Users</CardTitle>
        <CardDescription>Add new users or edit the details of existing users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='xs:flex-row flex flex-col items-center justify-between gap-4'>
            <Input
              placeholder='Search name or email...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full max-w-md flex-1'
            />
            <Button
              type='button'
              className='xs:w-auto w-full text-base'
              onClick={() => setAddOpen(true)}
            >
              <UserPlus /> Add User
            </Button>
          </div>

          {filteredUsers.length === 0 ? (
            <p className='text-muted-foreground italic'>No users found.</p>
          ) : (
            <div className='overflow-hidden rounded-lg border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Slack ID</TableHead>
                    <TableHead>Assigned Groups</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <ContextActions key={user.id} actions={contextActions(user)}>
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.admin ? 'default' : 'outline'}>
                            {user.admin ? 'Admin' : 'User'}
                          </Badge>
                          {user.disabled && (
                            <Badge variant='destructive' className='ml-2'>
                              Disabled
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{user.slackId || '-'}</TableCell>
                        <TableCell>
                          {getGroupNames(user.assignedGroups).join(', ') || '-'}
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownActions actions={contextActions(user)} />
                        </TableCell>
                      </TableRow>
                    </ContextActions>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <EditUserDialog open={editOpen} onOpenChange={setEditOpen} user={selectedUser} />
          <AddUserDialog open={addOpen} onOpenChange={setAddOpen} />
        </div>
      </CardContent>
    </Card>
  );
}
