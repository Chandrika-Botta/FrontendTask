import React, { useEffect, useState } from "react";

function App() {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 5;

  useEffect(() => {
    // Simulate fetching from local JSON
    fetch("/companies.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load company data");
        return res.json();
      })
      .then((data) => {
        setCompanies(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle search/filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredData = companies.filter(
      (c) =>
        c.name.toLowerCase().includes(value) ||
        c.location.toLowerCase().includes(value) ||
        c.industry.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (e) => {
    const sortType = e.target.value;
    setSortBy(sortType);
    let sorted = [...filtered];
    if (sortType === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "industry") {
      sorted.sort((a, b) => a.industry.localeCompare(b.industry));
    }
    setFiltered(sorted);
  };

  // Pagination logic
  const indexOfLast = currentPage * companiesPerPage;
  const indexOfFirst = indexOfLast - companiesPerPage;
  const currentCompanies = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / companiesPerPage);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  // Loading and error states
  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Companies Directory
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by name, location, or industry"
          value={search}
          onChange={handleSearch}
          className="border p-2 rounded-md w-full md:w-1/2"
        />

        <select
          value={sortBy}
          onChange={handleSort}
          className="border p-2 rounded-md w-full md:w-1/4"
        >
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="industry">Industry</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCompanies.map((company) => (
          <div
            key={company.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-600">
              {company.name}
            </h2>
            <p className="text-gray-700 mt-2">
              <strong>Location:</strong> {company.location}
            </p>
            <p className="text-gray-700">
              <strong>Industry:</strong> {company.industry}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
