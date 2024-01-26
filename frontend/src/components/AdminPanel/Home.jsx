import React, { useEffect } from 'react';
import AdminNavbar from './NavBar';
import AdminGamesRecords from './GamesRecords';
import AdminControlBar from './ControlBar';
// import sound from '../../assets/notification-1.mp3';

function AdminHome() {

    // const playNotificationSound = () => {
    //     const notificationSound = new Audio(sound);
    //     notificationSound.play();
    // };

    // // Use useEffect to start the interval when the component mounts
    // useEffect(() => {
    //     const notificationInterval = setInterval(() => {
    //         playNotificationSound();
    //     }, 10000);
    // });

    return (
        <div className='h-auto md:overflow-auto'>
            <AdminNavbar />
            <AdminControlBar />
            {/* <AdminGamesRecords /> */}
        </div>
    );
}

export default AdminHome;
