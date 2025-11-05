"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [advocates, setAdvocates] = useState([]);
    const [filteredAdvocates, setFilteredAdvocates] = useState([]);

    useEffect(() => {
        console.log("fetching advocates...");
        fetch("/api/advocates").then((response) => {
            response.json().then((jsonResponse) => {
                setAdvocates(jsonResponse.data);
                setFilteredAdvocates(jsonResponse.data);
            });
        });
    }, []);

    const onChange = (e) => {
        const searchTerm = e.target.value;

        document.getElementById("search-term")!.innerHTML = searchTerm;

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

    const onClick = () => {
        console.log(advocates);
        setFilteredAdvocates(advocates);
    };

    return (
        <main style={{ margin: "24px" }}>
            <h1>Solace Advocates</h1>
            <br />
            <br />
            <div>
                <p>Search</p>
                <p>
                    Searching for: <span id="search-term"></span>
                </p>
                <input style={{ border: "1px solid black" }} onChange={onChange} />
                <button onClick={onClick}>Reset Search</button>
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
                            <tr key={advocate.id}>
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
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    specialties: string[];
    yearsOfExperience: number;
    phoneNumber: number;
}