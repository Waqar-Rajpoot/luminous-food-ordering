// 'use client';

// import { useMemo } from 'react';
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
//   type MRT_ColumnDef,
// } from 'material-react-table';
// import { Loader2, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import { IReview } from '@/models/Review.model';
// import { format } from 'date-fns';

// interface ReviewsTableProps {
//   reviews: IReview[];
//   isLoading: boolean;
//   isActionLoading: boolean;
//   handleToggleApproval: (reviewId: string, currentStatus: boolean) => void;
//   handleDeleteReview: (reviewId: string) => void;
// }

// const ReviewsTable = ({
//   reviews,
//   isLoading,
//   isActionLoading,
//   handleToggleApproval,
//   handleDeleteReview,
// }: ReviewsTableProps) => {

//   const columns = useMemo<MRT_ColumnDef<IReview>[]>(
//     () => [
//       {
//         accessorKey: 'name',
//         header: 'Customer',
//         size: 150,
//       },
//       {
//         accessorKey: 'email',
//         header: 'Email',
//         size: 200,
//       },
//       {
//         accessorKey: 'rating',
//         header: 'Rating',
//         size: 100,
//         Cell: ({ cell }) => (
//           <span className="text-yellow-400">
//             {'★'.repeat(cell.getValue<number>())}
//           </span>
//         ),
//       },
//       {
//         accessorKey: 'review',
//         header: 'Review',
//         size: 300,
//         enableSorting: false,
//         enableColumnFilter: false,
//       },
//       {
//         accessorKey: 'isApproved',
//         header: 'Status',
//         size: 100,
//         Cell: ({ cell }) => (
//           <Badge
//             variant={cell.getValue<boolean>() ? 'default' : 'destructive'}
//             className="px-3 py-1 text-sm"
//           >
//             {cell.getValue<boolean>() ? 'Approved' : 'Pending'}
//           </Badge>
//         ),
//       },
//       {
//         accessorFn: (originalRow) => format(new Date(originalRow.createdAt), 'MMM dd, yyyy'),
//         id: 'createdAt',
//         header: 'Date',
//         size: 150,
//       },
//       {
//         id: 'actions',
//         header: 'Actions',
//         size: 150,
//         enableSorting: false,
//         enableColumnFilter: false,
//         Cell: ({ row }) => (
//           <div className="flex space-x-2">
//             {/* Toggle Approval Button */}
//             <Button
//               variant={row.original.isApproved ? 'destructive' : 'default'}
//               size="icon"
//               onClick={() => handleToggleApproval(row.original._id, row.original.isApproved)}
//               disabled={isActionLoading}
//               className="h-8 w-8"
//               style={{ backgroundColor: row.original.isApproved ? '#dc2626' : '#22c55e' }}
//             >
//               {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
//                 row.original.isApproved ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />
//               )}
//               <span className="sr-only">{row.original.isApproved ? 'Unapprove' : 'Approve'}</span>
//             </Button>

//             {/* Delete Review Confirmation */}
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   disabled={isActionLoading}
//                   className="h-8 w-8 text-red-500 hover:bg-red-500/10"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                   <span className="sr-only">Delete</span>
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent className="bg-gray-900 text-white border border-red-700">
//                 <AlertDialogHeader>
//                   <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
//                   <AlertDialogDescription className="text-gray-300">
//                     This action cannot be undone. This will permanently delete the review from your database.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">Cancel</AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={() => handleDeleteReview(row.original._id)}
//                     className="bg-red-600 text-white hover:bg-red-700"
//                   >
//                     {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </div>
//         ),
//       },
//     ],
//     [handleToggleApproval, handleDeleteReview, isActionLoading],
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data: reviews,
//     state: { isLoading },
//     enableColumnActions: false,
//     enableColumnFilters: true,
//     enablePagination: true,
//     enableSorting: true,
//     enableRowSelection: false,
//     enableDensityToggle: false,
//     enableFullScreenToggle: false,
//     muiTablePaperProps: {
//       elevation: 0,
//       sx: {
//         borderRadius: '8px',
//         border: '1px solid #EFA765',
//         backgroundColor: '#141f2d',
//       },
//     },
//     muiTableHeadCellProps: {
//       sx: {
//         backgroundColor: '#1c2a3b',
//         color: '#EFA765',
//         fontWeight: 'bold',
//       },
//     },
//     muiTableBodyRowProps: {
//       sx: {
//         '&:hover': {
//           backgroundColor: '#1c2a3b',
//           cursor: 'pointer',
//         },
//       },
//     },
//     muiTableBodyCellProps: {
//       sx: {
//         color: '#EFA765',
//       },
//     },
//     muiSearchTextFieldProps: {
//       label: 'Search reviews',
//       variant: 'outlined',
//       sx: {
//         '& .MuiInputBase-input': { color: '#EFA765' },
//         '& .MuiInputLabel-root': { color: '#EFA765' },
//         '& .MuiOutlinedInput-notchedOutline': { borderColor: '#EFA765' },
//         '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#EFA765' },
//         '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#EFA765' },
//       },
//     },
//     renderEmptyRowsFallback: () => (
//       <div className="text-center p-8 text-gray-400">
//         <p className="text-xl">No reviews found yet.</p>
//       </div>
//     ),
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default ReviewsTable;
