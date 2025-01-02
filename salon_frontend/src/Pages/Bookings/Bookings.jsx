import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "../Components/Navbar";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";


export function Bookings() {
    const teamMembers = [
        { name: 'John Doe', phone: '7329892389', email: 'john@gmail.com', date: 'Jan 4, 2024', access: 'Admin' },
        { name: 'Circooles', phone: '1234235346', email: 'john@gmail.com', date: 'Jan 4, 2024', access: 'Admin' },
        { name: 'Command+R', phone: '1776983421', email: 'john@gmail.com', date: 'Jan 2, 2024', access: 'Admin' },
        { name: 'Hourglass', phone: '4904576891', email: 'john@gmail.com', date: 'Jan 6, 2024', access: 'Admin' },
        { name: 'Layers', phone: '8754638290', email: 'john@gmail.com', date: 'Jan 8, 2024', access: 'Admin' },
        { name: 'Quotient', phone: '4254679845', email: 'john@gmail.com', date: 'Jan 6, 2024', access: 'Super Admin' },
        { name: 'Sisyphus', phone: '8009090900', email: 'john@gmail.com', date: 'Jan 4, 2024', access: 'Admin' },
    ];

    return (
        <div>
            <Navbar />
            <div className="p-8">
                <div className="flex items-center mb-4 justify-between p-8">
                    <div className="flex flex-col mb-7">
                        <span className="text-black font-bold text-3xl">Appointments</span>
                        <span className="text-gray-500 font-thin text-xl">view and export appointments booked by your clients</span>
                    </div>
                    <div className="space-x-4">
                        <Button variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg">
                            Create Appointment
                        </Button>
                        <Button variant="outline" className="text-black px-4 py-2 rounded-lg">
                            Clients
                        </Button>
                    </div>

                </div>

                <div className="bg-white shadow-xl rounded-lg">
                    <div className="flex space-x-4 p-7">
                        <Input
                            type="text"
                            placeholder="Search"
                            className="flex-grow p-5 rounded-lg"
                        />
                        <Input
                            type="text"
                            placeholder="Month to date"
                            className="flex-grow p-5 rounded-lg"
                        />
                        <Input
                            type="text"
                            placeholder="Filters"
                            className="flex-grow p-5 rounded-lg"
                        />
                        <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg">
                            Export
                        </Button>
                    </div>

                    <Table className="w-full bg-white shadow-xl rounded-lg">

                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-black'>Team member</TableHead>
                                <TableHead className='text-black'>Phone number</TableHead>
                                <TableHead className='text-black'>Email address</TableHead>
                                <TableHead className='text-black'>Date of joining</TableHead>
                                <TableHead className='text-black'>Access type</TableHead>
                                <TableHead className='text-black'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamMembers.map((member, index) => (
                                <TableRow key={index}>
                                    <TableCell className="flex items-center space-x-4">
                                        <span className="rounded-full bg-gray-200 w-8 h-8 bg-"></span>
                                        <span>{member.name}</span>
                                    </TableCell>
                                    <TableCell>{member.phone}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>{member.date}</TableCell>
                                    <TableCell>{member.access}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        {/* Add action buttons here */}
                                        <button className="text-blue-500 hover:underline">Edit</button>
                                        <button className="text-red-500 hover:underline">Delete</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
