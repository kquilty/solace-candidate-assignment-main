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
            return (
                advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
                advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
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
            <h1>Solace Advocates</h1>
            <br />
            <br />
            <div>
                <p>Search</p>
                <p>
                    Searching for: {filterValue}
                </p>
                <input 
                    id="search-input" 
                    style={{ border: "1px solid black" }} 
                    value={filterValue}
                    onChange={onFilterTextChange} 
                    />
                <button onClick={onResetSearchClick}>Reset Search</button>
            </div>
            <br />
            <br />
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>City</th>
                        <th>Degree</th>
                        <th>Specialties</th>
                        <th>Years of Experience</th>
                        <th>Phone Number</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAdvocates.map((advocate: Advocate) => {
                        return (
                            <tr key={advocate.firstName + advocate.lastName + advocate.phoneNumber}>
                                <td>{advocate.firstName}</td>
                                <td>{advocate.lastName}</td>
                                <td>{advocate.city}</td>
                                <td>{advocate.degree}</td>
                                <td>
                                    {advocate.specialties.map((s: string) => (
                                        <div key={s}>{s}</div>
                                    ))}
                                </td>
                                <td>{advocate.yearsOfExperience}</td>
                                <td>{advocate.phoneNumber}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </main>
    );
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