// Dashboard analytics/stat cards data
const statCards = [
  {
    icon: '📊',
    title: 'Overview',
    value: 'Dashboard',
    change: 'Main Overview',
    changeClass: '',
  },
  {
    icon: '📝',
    title: 'Total Applications',
    value: '2,847',
    change: '+15.3%',
    changeClass: 'positive',
  },
  {
    icon: '✅',
    title: 'Approved',
    value: '2,456',
    change: '+12.8%',
    changeClass: 'positive',
  },
  {
    icon: '❌',
    title: 'Rejected',
    value: '123',
    change: '-2.1%',
    changeClass: 'negative',
  },
  {
    icon: '⏳',
    title: 'Pending',
    value: '268',
    change: '+3.7%',
    changeClass: 'positive',
  },
  {
    icon: '⏱️',
    title: 'Avg Processing Time',
    value: '3.2 min',
    change: '-18.4%',
    changeClass: 'positive',
  },
  {
    icon: '📈',
    title: 'Conversion Rate',
    value: '86.2%',
    change: '+4.2%',
    changeClass: 'positive',
  },
  {
    icon: '🔄',
    title: 'API Calls',
    value: '1,024', // default, can be replaced by prop
    change: '+2.5%',
    changeClass: 'positive',
  },
  {
    icon: '🗂️',
    title: 'Form Data Count',
    value: '512', // default, can be replaced by prop
    change: '+1.8%',
    changeClass: 'positive',
  },
];

export default statCards;
