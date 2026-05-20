/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { PublicCard } from "./components/PublicCard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/card/:id" element={<PublicCard />} />
      </Routes>
    </BrowserRouter>
  );
}
