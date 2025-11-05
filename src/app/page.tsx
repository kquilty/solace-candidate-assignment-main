"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [advocates, setAdvocates] = useState([]);
    const [filteredAdvocates, setFilteredAdvocates] = useState([]);
    const [filterValue, setFilterValue] = useState(''); 


    // On load...
    useEffect(() => {
        console.log("fetching advocates...");
        fetch("/api/advocates").then((response) => {
            response.json().then((jsonResponse) => {
                setAdvocates(jsonResponse.data);
                setFilteredAdvocates(jsonResponse.data);
            });
        });
    }, []);


    const onFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;

        setFilterValue(searchTerm);

        // Filter advocates based on search term
        let lowerSearchTerm = searchTerm.toLowerCase();
        const filteredAdvocates = advocates.filter((advocate: Advocate) => {
            let fullName = advocate.firstName + " " + advocate.lastName;
            return (
                fullName.toLowerCase().includes(lowerSearchTerm) ||
                advocate.city.toLowerCase().includes(lowerSearchTerm) ||
                advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
                advocate.specialties.some((s) => s.toLowerCase().includes(lowerSearchTerm)) ||
                advocate.yearsOfExperience.toString().includes(lowerSearchTerm)
                // || advocate.phoneNumber.toString().includes(lowerSearchTerm) <--- not matching on phone for now
            );
        });

        setFilteredAdvocates(filteredAdvocates);
    };

    const onResetSearchClick = () => {
        console.log(advocates);
        setFilteredAdvocates(advocates);

        // Reset the input (and refocus it)
        setFilterValue('');
        (document.getElementById("search-input") as HTMLInputElement).focus();
    };

    return (
        <main style={{ margin: "24px" }}>
            <h1 className="title">Solace Advocates</h1>
            <div>
                <input 
                    id="search-input" 
                    placeholder="Search..."
                    className="search-input"
                    value={filterValue}
                    onChange={onFilterTextChange} 
                    />

                <div style={{ display: filterValue ? 'block' : 'none' }}>
                    Searching for:
                    <span className="search-pill">
                        <strong>{filterValue}</strong> 
                        <button 
                            id="reset-search-button"
                            onClick={onResetSearchClick}
                            title="Clear Search"
                            >x</button>
                    </span>
                </div>


            </div>
            
            <table className="results-table">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>City</th>
                        <th>Degree</th>
                        <th>Specialties</th>
                        <th style={{ textAlign: 'center' }}>Years of Experience</th>
                        <th style={{ textAlign: 'center' }}>Phone Number</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAdvocates.map((advocate: Advocate) => {
                        return (
                            <tr key={advocate.firstName + advocate.lastName + advocate.phoneNumber}>
                                <td style={{whiteSpace: 'nowrap'}}>{advocate.firstName} {advocate.lastName}</td>
                                <td style={{whiteSpace: 'nowrap'}}>{advocate.city}</td>
                                <td>{advocate.degree}</td>
                                <td style={{ textAlign: 'left' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {advocate.specialties.map((specialtyName: string) => (
                                            <span key={specialtyName} style={{ 
                                                backgroundColor: '#e0e0e0', 
                                                padding: '2px 6px', 
                                                borderRadius: '4px', 
                                                fontSize: '12px' 
                                            }}>{specialtyName}</span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>{advocate.yearsOfExperience}</td>
                                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{formatPhoneNumber(advocate.phoneNumber)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </main>
    );

    function formatPhoneNumber(phoneNumber: number): string {
        const phoneString = phoneNumber.toString();
        return `(${phoneString.slice(0, 3)}) ${phoneString.slice(3, 6)}-${phoneString.slice(6)}`;
    }
}

interface Advocate {
    // id: string; <--- ID is not available yet (via the API).
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    specialties: string[];
    yearsOfExperience: number;
    phoneNumber: number;
}