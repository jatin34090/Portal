import React, { useState } from "react";
import FamilyDetails from "./Form/FamilyDetails";
import EducationalDetails from "./Form/EducationalDetails";
import BasicDetails from "./Form/BasicDetails";
import BatchDetails from "./Form/BatchRelatedDetails";

const FormDetailPage = () => {
  const [formOpen, setFormOpen] = useState("");

  const formDetails = [
    {
      id: "familyDetailsForm",
      title: "Family Details",
      description: "Fill out your family information in this section.",
      component: <FamilyDetails/>,
    },
    {
      id: "educationalDetailsForm",
      title: "Educational Details",
      description: "Provide your educational background here.",
      component: <EducationalDetails/>,
    },
    {
      id: "basicDetailsForm",
      title: "Basic Details",
      description: "Add your basic details in this section.",
      component: <BasicDetails/>,
    },
    {
      id: "batchDetailsForm",
      title: "Batch Details",
      description: "Specify your batch-related information here.",
      component: <BatchDetails/>,
    },
  ];

  return (
    <div className="w-full">
      <div id="accordion">
        {formDetails.map((form) => (
          <div key={form.id}>
            <h2>
              <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                onClick={() =>
                  setFormOpen((prev) => (prev === form.id ? "" : form.id))
                }
                aria-expanded={formOpen === form.id}
                aria-controls={form.id}
              >
                <span>{form.title}</span>
                <svg
                  className={`w-3 h-3 shrink-0 ${
                    formOpen === form.id ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            {formOpen === form.id && (
              <div id={form.id} className="p-5 border border-gray-200">
                <p className="mb-2">{form.description}</p>
                {form.component}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormDetailPage;
