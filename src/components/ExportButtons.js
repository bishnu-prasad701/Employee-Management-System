import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";

const ExportButtons = () => {
  const employees = useSelector((state) => state.employees.list);
  const handleExportExcel = () => {
    const exportData = employees.map((emp) => ({
      FullName: emp.fullName,
      EmployeeID: emp.employeeId,
      Email: emp.email,
      Phone: emp.phone,
      Designation: emp.designation,
      Department: emp.department,
      JoiningDate: emp.joiningDate,
      EmployeeType: emp.employeeType,
      WorkLocation: emp.workLocation,
      ProfilePicture: emp.profilePreview ? "Uploaded" : "Not Uploaded",
      Status: emp.status ? "Active" : "Inactive",
      IsAdmin: emp.isAdmin ? "Yes" : "No",
      ManagerID: emp.managerId,
      Skills: emp.skills,
      DateOfBirth: emp.dateOfBirth,
      EmergencyContact: emp.emergencyContact,
      EmergencyContactName: emp.emergencyContactName,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "EmployeeList.xlsx");
  };

  const generateIdCardPDF = async (emp) => {
    const idCard = document.createElement("div");
    idCard.style.width = "350px";
    idCard.style.height = "200px";
    idCard.style.padding = "16px";
    idCard.style.display = "flex";
    idCard.style.flexDirection = "column";
    idCard.style.border = "1px solid black";
    idCard.style.borderRadius = "10px";
    idCard.style.background = "white";
    idCard.style.fontFamily = "Arial";

    idCard.innerHTML = `
      <h3 style="margin: 0 0 12px 0; text-align: center;">Employee ID Card</h3>
      <div style="display: flex; flex-grow: 1; gap: 16px;">
        <div style="flex: 0 0 100px;">
          <img src="${
            emp.profilePreview || ""
          }" alt="Profile" style="width: 100px; height: 120px; border-radius: 8px; border: 1px solid black; object-fit: cover;" />
        </div>
        <div style="flex: 1; font-size: 14px; line-height: 1.4;">
          <div><strong>Name:</strong> ${emp.fullName}</div>
          <div><strong>Emp ID:</strong> ${emp.employeeId}</div>
          <div><strong>Phone:</strong> ${emp.phone}</div>
          <div><strong>Dept:</strong> ${emp.department}</div>
          <div><strong>Location:</strong> ${emp.workLocation}</div>
          <div><strong>Emergency:</strong> ${emp.emergencyContact}</div>
        </div>
      </div>
    `;

    document.body.appendChild(idCard);
    const canvas = await html2canvas(idCard);
    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = 500;
    const pdfHeight = 300;
    const cardWidth = 350;
    const cardHeight = 200;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [pdfWidth, pdfHeight],
    });

    const x = (pdfWidth - cardWidth) / 2;
    const y = (pdfHeight - cardHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);
    pdf.save(`ID_Card_${emp.employeeId || emp.fullName}.pdf`);
    document.body.removeChild(idCard);
  };

  return { handleExportExcel, generateIdCardPDF };
};

export default ExportButtons;
