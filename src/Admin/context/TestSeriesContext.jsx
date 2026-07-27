import { createContext, useContext, useState } from "react";

const seedTestSeries = [
  {
    id: 1,
    title: "UPSC Prelims 2027",
    description: "",
    price: "₹999",
    duration: "",
    thumbnail: "",
    tests: 100,
  },
  {
    id: 2,
    title: "KTET Test Series",
    description: "",
    price: "₹699",
    duration: "",
    thumbnail: "",
    tests: 50,
  },
  {
    id: 3,
    title: "PSC Mock Tests",
    description: "",
    price: "₹499",
    duration: "",
    thumbnail: "",
    tests: 30,
  },
];

const TestSeriesContext = createContext(null);

export function TestSeriesProvider({ children }) {
  const [testSeries, setTestSeries] = useState(seedTestSeries);

  const addTestSeries = (series) => {
    setTestSeries((prev) => [
      ...prev,
      { tests: 0, ...series, id: prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1 },
    ]);
  };

  const updateTestSeries = (id, updates) => {
    setTestSeries((prev) => prev.map((s) => (String(s.id) === String(id) ? { ...s, ...updates } : s)));
  };

  const deleteTestSeries = (id) => {
    setTestSeries((prev) => prev.filter((s) => String(s.id) !== String(id)));
  };

  const getTestSeries = (id) => testSeries.find((s) => String(s.id) === String(id));

  return (
    <TestSeriesContext.Provider
      value={{ testSeries, addTestSeries, updateTestSeries, deleteTestSeries, getTestSeries }}
    >
      {children}
    </TestSeriesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTestSeries() {
  const ctx = useContext(TestSeriesContext);
  if (!ctx) throw new Error("useTestSeries must be used within a TestSeriesProvider");
  return ctx;
}
