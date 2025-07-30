import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ContextActions } from '@/components/tables/context-actions';
import { DropdownActions } from '@/components/tables/dropdown-actions';
import { CalendarPlus, CalendarCog, Trash2, Edit2 } from 'lucide-react';
import { AdminCardSkeleton } from '@/components/skeletons/admin-card-skeleton';
import { toast } from 'sonner';
import { useGroups } from '@/contexts/groups-context';
import { AddSemesterDialog } from '@/components/dialogs/add-semester-dialog';
import { EditSemesterDialog } from '@/components/dialogs/edit-semester-dialog';

export function ManageSemesters() {
  const [semesters, setSemesters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const { groups } = useGroups();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'semesters'), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => (b.start?.seconds || 0) - (a.start?.seconds || 0));
      setSemesters(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredSemesters = semesters?.filter((semester) => {
    return semester.semester?.toLowerCase().includes(search.toLowerCase());
  });

  const getGroupName = (groupId) => {
    return groups.find((g) => g.id === groupId)?.name || groupId;
  };

  const handleEditClick = (semester) => {
    setSelectedSemester(semester);
    setEditOpen(true);
  };

  const handleDeleteSemester = (props, semesterId) => {
    return (
      <DeleteDialog
        triggerText='Delete Semester'
        deleteAction={() => {
          return toast.promise(console.log('Deleting semester:', semesterId), {
            loading: 'Deleting semester...',
            success: () => {
              props.onSuccess?.(true);
              return 'Semester deleted';
            },
            error: () => {
              props.onSuccess?.(false);
              return 'Failed to delete semester';
            },
          });
        }}
        {...props}
      />
    );
  };

  const contextActions = (semester) => [
    { text: 'Edit Semester', icon: CalendarCog, action: () => handleEditClick(semester) },
    'seperator',
    {
      text: 'Delete Semester',
      icon: Trash2,
      dialog: true,
      dialogContent: (props) => handleDeleteSemester(props, semester.id),
      destructive: true,
      disabled: true,
    },
  ];

  if (loading) {
    return <AdminCardSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Manage Semesters</CardTitle>
        <CardDescription>Create, update, and delete goal semesters.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='xs:flex-row flex flex-col items-center justify-between gap-4'>
            <Input
              placeholder='Search semester name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full max-w-md flex-1'
            />
            <Button
              type='button'
              className='xs:w-auto w-full text-base'
              onClick={() => setAddOpen(true)}
            >
              <CalendarPlus /> Add Semester
            </Button>
          </div>

          {filteredSemesters.length === 0 ? (
            <p className='text-muted-foreground italic'>No semesters found.</p>
          ) : (
            <div className='overflow-hidden rounded-lg border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semester</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Group Name</TableHead>
                    <TableHead className='hidden md:table-cell'>Focus</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSemesters.map((semester) => (
                    <ContextActions key={semester.id} actions={contextActions(semester)}>
                      <TableRow key={semester.id}>
                        <TableCell>{semester.semester}</TableCell>
                        <TableCell>
                          {format(semester.start?.toDate?.() || new Date(), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(semester.end?.toDate?.() || new Date(), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>{getGroupName(semester.group)}</TableCell>
                        <TableCell className='hidden max-w-[200px] truncate md:table-cell'>
                          {semester.focus || '-'}
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownActions actions={contextActions(semester)} />
                        </TableCell>
                      </TableRow>
                    </ContextActions>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <AddSemesterDialog open={addOpen} onOpenChange={setAddOpen} />
          <EditSemesterDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            semesterDoc={selectedSemester}
          />
        </div>
      </CardContent>
    </Card>
  );
}
