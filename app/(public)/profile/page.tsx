'use client'; // ক্লায়েন্ট সাইড নিশ্চিত করার জন্য এটিও যোগ করে দেওয়া ভালো

import dynamic from 'next/dynamic';

const ProfileChart = dynamic(() => import('@/components/landing/UserProfilePage'), {
  ssr: false, 
});

const page = () => {
  return (
    <div>
    
      <ProfileChart />
    </div>
  );
};

export default page;