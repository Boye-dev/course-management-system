export const getStatusColor = (status: string) => {
  const st = status.toLowerCase();

  switch (st) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'red';
    default:
      return 'grey';
  }
};
