import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useService } from '../../hooks/useService';

const AdminWithdrawalApprovals = () => {
    const service = useService();
    const [tableData, setTableData] = useState([]);
    const [statusOptions] = useState(['Select Status', 'Pending', 'Success', 'Rejected']);
    const navigate = useNavigate();
    const [withdrawSearchInput, setWithdrawSearchInput] = useState('');

    useEffect(() => {
        service.get('/admin/adminWithdrawalApprovalsPage')
            .then(response => {
                setTableData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [service]);

    // Navigators
    const navigateToAdminPage = () => {
        navigate(-1);
    };

    // Handlers
    const handleStatusChange = (index, selectedStatus) => {
        const updatedData = [...tableData];
        updatedData[index].status = selectedStatus;
        setTableData(updatedData);
        handleSubmit(index);
    };

    const handleRemarksChange = (index, remarks) => {
        const updatedData = [...tableData];
        updatedData[index].adminRemarks = remarks;
        setTableData(updatedData);
    };
    const handleUTRChange = (index, utr) => {
        const updatedData = [...tableData];
        updatedData[index].utrId = utr;
        setTableData(updatedData);
    };

    const handleAmountChange = (index, amount) => {
        const updatedData = [...tableData];
        updatedData[index].amount = amount;
        setTableData(updatedData);
    };

    const handleWithdrawSearch = () => {
        const searchTerm = withdrawSearchInput.trim();
        if (searchTerm === '') {
            alert("Invalid Mobile Number.");
        }
        const filteredData = tableData.filter((row) =>
            String(row.mobileNumber).includes(searchTerm)
        );
        setTableData(filteredData);
    };

    const handleSubmit = async (index) => {
        const row = tableData[index];
        if (row.status === 'Select Status') {
            alert('Invalid Request!!! Please select a valid status.');
            return;
        }
        if (
            (row.status === 'Pending' || row.status === 'Rejected') &&
            (!row.adminRemarks || row.adminRemarks.trim() === '')
        ) {
            alert('Remarks are required for Pending and Rejected status.');
            return;
        }
        try {
            const response = await service.patch(`/admin/adminWithdrawalApprovalsPage/${row._id}`, {
                utrId: row.utrId,
                amount: row.amount,
                status: row.status,
                adminRemarks: row.adminRemarks,
            });
            const updatedData = [...tableData];
            updatedData[index] = response.data;
            setTableData(updatedData);
            alert(`Transaction Updated Successfully`);
            navigate(0);
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };


    return (
        <div className="flex w-full h-auto">
            <div className="flex flex-col items-center justify-center w-full p-2">
                <div className="text-center font-bold text-white text-2xl md:text-4xl lg:text-6xl my-4">Withdrawals Approvals Table</div>
                <div className="w-full flex flex-col items-center">
                    <div className="flex w-1/2 md:1/4 items-center my-4">
                        <input
                            type="text"
                            placeholder="Search by ID, Date and Time, or User-ID"
                            value={withdrawSearchInput}
                            onChange={(e) => setWithdrawSearchInput(e.target.value)}
                            className="w-full text-slate-900 rounded-md border-2 py-2 px-4 m-4"
                        />
                        <button
                            onClick={handleWithdrawSearch}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                            Search
                        </button>
                    </div>
                    <div className="w-full h-auto grid mb-20 overflow-x-auto lg:overflow-hidden">
                        <table className="w-[94%] md:w-10/12 left-0 right-0 mx-auto text-sm text-slate-900 rounded-xl border-4">
                            <thead className="bg-black text-white font-bold">
                                <tr>
                                    <th className="text-center border-4 p-2">ID</th>
                                    <th className="text-center border-4 p-2">User-ID</th>
                                    <th className="text-center border-4 p-2">UTR</th> {/* *Unique Transaction Reference */}
                                    <th className="text-center border-4 p-2">Mobile Number</th>
                                    <th className="text-center border-4 p-2">Wallet Balance</th>
                                    <th className="text-center border-4 p-2">Create Time</th>
                                    <th className="text-center border-4 p-2">Update Time</th>
                                    <th className="text-center border-4 p-2">Withdrawal Amount</th>
                                    <th className="text-center border-4 p-2">Remarks</th>
                                    <th className="text-center border-4 p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, index) => (
                                    <tr key={index} className="bg-white font-semibold">
                                        <td className="text-center border-2">{index + 1}</td>
                                        <td className="text-center border-2">{row.userId}</td>
                                        <td className="text-center border-2">{row.status === 'Pending' ? (
                                            <div>
                                                <input
                                                    type="text" name="utrId" id="utrId"
                                                    value={row.utrId}
                                                    onChange={(e) => handleUTRChange(index, e.target.value)}
                                                    placeholder="Unique Transaction Reference"
                                                    className="text-black font-semibold border-black border-2"
                                                />
                                            </div>
                                        ) : (
                                            <div>{row.utrId}</div>
                                        )}</td>
                                        <td className="text-center border-2">{row.mobileNumber}</td>
                                        <td className="text-center border-2">{row.walletBalance}</td>
                                        <td className="text-center border-2">
                                            {row.createdAt}
                                        </td>
                                        <td className="text-center border-2">
                                            {row.updatedAt}
                                        </td>
                                        <td className="text-center border-2">{row.status === 'Pending' ? (
                                            <div>
                                                <input
                                                    type="number" name="dAmount" id="dAmount"
                                                    value={row.amount}
                                                    onChange={(e) => handleAmountChange(index, e.target.value)}
                                                    placeholder="Deposit Amount"
                                                    min={100}
                                                    className="text-black font-semibold border-black border-2"
                                                />
                                            </div>
                                        ) : (
                                            <div>{row.amount}</div>
                                        )}</td>
                                        <td className="text-center border-2">
                                            {row.status === 'Pending' ? (
                                                <div>
                                                    <textarea
                                                        value={row.adminRemarks}
                                                        onChange={(e) => handleRemarksChange(index, e.target.value)}
                                                        placeholder="Fill the text area with remarks for approved, rejected, and pending approvals."
                                                        className="text-black font-semibold border-black border-2"
                                                    ></textarea>
                                                </div>
                                            ) : (
                                                <div>{row.adminRemarks}</div>
                                            )}
                                        </td>
                                        <td className="py-3 text-center border-2 px-6 w-1/12">
                                            {row.status === 'Success' ? (
                                                <div className="bg-green-700 text-white h-10 flex items-center justify-center">
                                                    Success
                                                </div>
                                            ) : row.status === 'Rejected' ? (
                                                <div className="bg-red-700 text-white h-10 flex items-center justify-center">
                                                    Rejected
                                                </div>
                                            ) : (
                                                <select
                                                    value={row.status}
                                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                                    className={`text-white text-center rounded-lg h-10 font-bold border-white border-2 ${row.status === 'Pending'
                                                        ? 'bg-yellow-500'
                                                        : row.status === 'Rejected'
                                                            ? 'bg-red-500' : row.status === 'Success' ? 'bg-green-500'
                                                                : 'bg-gray-500'
                                                        }`}
                                                >
                                                    {statusOptions.map((option, optionIndex) => (
                                                        <option key={optionIndex} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-black">
                                    <th className="text-center border-4 p-4"></th>
                                    <th className="text-center border-4 p-4"></th>
                                    <th className="text-center border-4 p-4"></th>
                                    <th className="text-center border-4 p-4"></th>
                                    <th className="text-center border-4 p-4"></th>
                                    <th className="text-center border-4 p-4"></th>
                                    <th className="text-center border-4 p-4"></th>
                                    <th className="text-center border-4 p-4"></th>
                                    <th className="text-center border-4 p-4"></th>
                                    <th className="text-center border-4 p-4"></th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="absolute top-1 right-1 bg-black hover:bg-green-600 text-white shadow-md shadow-white m-2 p-2 rounded-lg">
                <button onClick={navigateToAdminPage}>
                    <FaHome size={30} />
                </button>
            </div>
        </div>
    );
};

export default AdminWithdrawalApprovals;
