const HORIZON_SCENARIO_SCHEMA = {
  "views": {
    "germany": {
      "program": {
        "type": "enum",
        "values": [
          "tu-dortmund-automation-robotics",
          "tu-dresden-nanoelectronic-systems",
          "uni-due-automation-safety",
          "fau-autonomy-technologies"
        ]
      },
      "budget-mode": {
        "type": "enum",
        "values": [
          "sources",
          "allocation"
        ]
      },
      "savings_azn": {
        "type": "number",
        "min": 0,
        "step": 1
      },
      "azn_per_eur": {
        "type": "number",
        "min": 0.0001,
        "step": 0.0001
      },
      "rotating_branch": {
        "type": "enum",
        "values": [
          "0",
          "10000"
        ]
      },
      "initial_liquid": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "blocked_initial": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "start_date": {
        "type": "date"
      },
      "study_months": {
        "type": "number",
        "min": 1,
        "max": 60,
        "step": 1
      },
      "search_months": {
        "type": "number",
        "min": 0,
        "max": 36,
        "step": 1
      },
      "rent": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "social": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "student_hours": {
        "type": "number",
        "min": 0,
        "max": 20,
        "step": 1
      },
      "student_job_start": {
        "type": "number",
        "min": 1,
        "max": 60,
        "step": 1
      },
      "scholarship": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "food": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "insurance": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "other": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "semester_fee": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "tuition": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "initial_cost": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "reserve": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "blocked_release": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "hourly_gross": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "net_factor": {
        "type": "number",
        "min": 0,
        "max": 1,
        "step": 0.01
      },
      "work_net": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "salary_delay": {
        "type": "number",
        "min": 0,
        "max": 12,
        "step": 1
      },
      "annual_inflation": {
        "type": "number",
        "min": 0,
        "max": 1,
        "step": 0.01
      },
      "repayment_monthly": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "repayment_start": {
        "type": "number",
        "min": 1,
        "max": 156,
        "step": 1
      },
      "repayment_months": {
        "type": "number",
        "min": 0,
        "max": 156,
        "step": 1
      },
      "move_month": {
        "type": "number",
        "min": 1,
        "max": 156,
        "step": 1
      },
      "move_cost": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "german_level": {
        "type": "enum",
        "values": [
          "A1",
          "A2",
          "B1",
          "B2",
          "C1"
        ]
      },
      "study_hours": {
        "type": "number",
        "min": 0,
        "max": 100,
        "step": 1
      },
      "german_hours": {
        "type": "number",
        "min": 0,
        "max": 60,
        "step": 1
      },
      "social_hours": {
        "type": "number",
        "min": 0,
        "max": 60,
        "step": 1
      },
      "commute_hours": {
        "type": "number",
        "min": 0,
        "max": 60,
        "step": 1
      },
      "relationship": {
        "type": "enum",
        "values": [
          "open",
          "dating",
          "cohabit",
          "marriage"
        ]
      },
      "shared_start": {
        "type": "number",
        "min": 1,
        "max": 156,
        "step": 1
      },
      "shared_saving": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "birth_date": {
        "type": "date"
      }
    },
    "work": {
      "country": {
        "type": "enum",
        "values": [
          "all",
          "AU",
          "CA",
          "DE",
          "GB",
          "PL",
          "US"
        ]
      },
      "route": {
        "type": "enum",
        "values": [
          "AU-SID-482-CORE",
          "AU-SID-482-SPECIALIST",
          "AU-SKILLED-189-POINTS",
          "ca-federal-skilled-worker",
          "ca-employer-specific-lmia-work-permit",
          "DE-SKILLED-ACADEMIC-JOB",
          "DE-EU-BLUE-CARD-STANDARD",
          "DE-EU-BLUE-CARD-NEW-GRADUATE",
          "DE-OPPORTUNITY-CARD-RECOGNIZED",
          "DE-OPPORTUNITY-CARD-POINTS",
          "DE-PROFESSIONALLY-EXPERIENCED",
          "gb-skilled-worker-standard",
          "gb-skilled-worker-new-entrant",
          "PL-EMPLOYER-WORK-PERMIT-RESIDENCE",
          "PL-EU-BLUE-CARD",
          "US-H1B-CAP",
          "US-H1B-CAP-EXEMPT",
          "US-L1-TRANSFER"
        ]
      },
      "start_date": {
        "type": "date"
      },
      "additional_departure_delay_months": {
        "type": "number",
        "min": 0
      },
      "bridge_months": {
        "type": "number",
        "min": 0
      },
      "budget_azn": {
        "type": "number",
        "min": 0
      },
      "experience_months": {
        "type": "number",
        "min": 0
      },
      "annual_gross_salary_local": {
        "type": "number",
        "min": 0
      },
      "local_language_certified_cefr": {
        "type": "enum",
        "values": [
          "null",
          "A1",
          "A2",
          "B1",
          "B2",
          "C1",
          "C2"
        ]
      },
      "english_certified_cefr": {
        "type": "enum",
        "values": [
          "null",
          "A1",
          "A2",
          "B1",
          "B2",
          "C1",
          "C2"
        ]
      },
      "english_clb": {
        "type": "number",
        "min": 0
      },
      "route_points": {
        "type": "number",
        "min": 0
      },
      "degree_completed": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "degree_recognized": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "legal_departure_verified": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "offer_available": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "job_requirements_verified": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "sponsor_approved": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "experience_qualifies_verified": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "salary_rule_verified": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "selection_or_invitation_confirmed": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "extra_route_requirements_verified": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "funds_documented": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "financial_proof_exemption_verified": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "funds_unencumbered_verified": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "authority_approval_confirmed": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "points_calculation_verified": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "employer_entry_policy_verified": {
        "type": "enum",
        "values": [
          "null",
          "true",
          "false"
        ]
      },
      "setup_cost_local": {
        "type": "number",
        "min": 0
      },
      "monthly_expense_local": {
        "type": "number",
        "min": 0
      },
      "monthly_net_pay_local": {
        "type": "number",
        "min": 0
      },
      "months": {
        "type": "number",
        "min": 0
      },
      "income_start_month": {
        "type": "number",
        "min": 0
      },
      "pay_delay_months": {
        "type": "number",
        "min": 0
      },
      "job_loss_month": {
        "type": "number",
        "min": 0
      },
      "job_loss_months": {
        "type": "number",
        "min": 0
      },
      "annual_expense_growth": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "reserve_months": {
        "type": "number",
        "min": 0
      },
      "repayment_monthly_azn": {
        "type": "number",
        "min": 0
      },
      "repayment_months": {
        "type": "number",
        "min": 0
      }
    },
    "pusula": {
      "country": {
        "type": "enum",
        "values": [
          "all",
          "AU",
          "CA",
          "DE",
          "GB",
          "PL",
          "US"
        ]
      },
      "program": {
        "type": "enum",
        "values": [
          "AU-UNSW-ENGINEERING-SCIENCE-ROBOTICS-2026",
          "AU-UQ-ENGINEERING-SCIENCE-MECHATRONIC-2026",
          "umanitoba-ece-msc-thesis",
          "uwaterloo-ece-masc-research",
          "de-tum-robotics-cognition-intelligence",
          "de-tum-mechatronics-robotics-biomechanical-engineering",
          "de-tu-berlin-electrical-engineering",
          "de-tu-berlin-computer-engineering",
          "de-haw-hamburg-automation-technology",
          "de-hsd-electrical-engineering-information-technology",
          "tu-dortmund-automation-robotics",
          "tu-dresden-nanoelectronic-systems",
          "uni-due-automation-safety",
          "fau-autonomy-technologies",
          "gb-bristol-robotics-msc",
          "gb-southampton-robotics-autonomous-systems-msc",
          "PL-PWR-CONTROL-ROBOTICS-EMBEDDED-2026",
          "PL-WUT-ROBOTICS-AUTOMATIC-CONTROL-2026",
          "cornell-ece-meng-ithaca",
          "cornell-robotics-phd-mae"
        ]
      },
      "budget": {
        "type": "number",
        "min": 0
      },
      "living": {
        "type": "number",
        "min": 0
      },
      "multiplier": {
        "type": "number",
        "min": 0.1,
        "step": 0.1
      },
      "award": {
        "type": "number",
        "min": 0
      },
      "repay": {
        "type": "number",
        "min": 0
      },
      "repay-months": {
        "type": "number",
        "min": 0,
        "max": 120
      },
      "funding-case": {
        "type": "enum",
        "values": [
          "",
          "waterloo-published-minimum-conditional",
          "cornell-12-month-package-hypothesis",
          "cornell-15-percent-receipt-stress"
        ]
      }
    },
    "index": {
      "route": {
        "type": "enum",
        "values": [
          "de-work",
          "de-master",
          "us-phd",
          "ca-master",
          "emjm",
          "de-search",
          "bridge"
        ]
      },
      "case": {
        "type": "enum",
        "values": [
          "base",
          "adverse",
          "strong"
        ]
      },
      "initial_cash": {
        "type": "number",
        "min": 0
      },
      "initial_cost": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "income_monthly": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "expense_monthly": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "reserve": {
        "type": "number",
        "min": 0,
        "step": 0.01
      },
      "months": {
        "type": "number",
        "min": 1,
        "max": 600,
        "step": 1
      }
    },
    "lab": {
      "gain": {
        "type": "number",
        "min": 0.1,
        "max": 10,
        "step": 0.1
      },
      "damping": {
        "type": "number",
        "min": 0.1,
        "max": 5,
        "step": 0.1
      },
      "band": {
        "type": "number",
        "min": 0,
        "max": 4,
        "step": 0.1
      },
      "sensor-case": {
        "type": "enum",
        "values": [
          "normal",
          "fault"
        ]
      },
      "csv": {
        "type": "text",
        "maxLength": 16000
      }
    }
  },
  "fx": {
    "EUR": 1.9095,
    "GBP": 2.2522,
    "CAD": 1.195,
    "USD": 1.7,
    "AUD": 1.1848,
    "PLN": 0.4367
  },
  "routeCurrencies": {
    "de-work": "EUR",
    "de-master": "EUR",
    "us-phd": "USD",
    "ca-master": "CAD",
    "emjm": "EUR",
    "de-search": "EUR",
    "bridge": "AZN"
  },
  "workCountries": {
    "AU-SID-482-CORE": "AU",
    "AU-SID-482-SPECIALIST": "AU",
    "AU-SKILLED-189-POINTS": "AU",
    "ca-federal-skilled-worker": "CA",
    "ca-employer-specific-lmia-work-permit": "CA",
    "DE-SKILLED-ACADEMIC-JOB": "DE",
    "DE-EU-BLUE-CARD-STANDARD": "DE",
    "DE-EU-BLUE-CARD-NEW-GRADUATE": "DE",
    "DE-OPPORTUNITY-CARD-RECOGNIZED": "DE",
    "DE-OPPORTUNITY-CARD-POINTS": "DE",
    "DE-PROFESSIONALLY-EXPERIENCED": "DE",
    "gb-skilled-worker-standard": "GB",
    "gb-skilled-worker-new-entrant": "GB",
    "PL-EMPLOYER-WORK-PERMIT-RESIDENCE": "PL",
    "PL-EU-BLUE-CARD": "PL",
    "US-H1B-CAP": "US",
    "US-H1B-CAP-EXEMPT": "US",
    "US-L1-TRANSFER": "US"
  },
  "studyCountries": {
    "AU-UNSW-ENGINEERING-SCIENCE-ROBOTICS-2026": "AU",
    "AU-UQ-ENGINEERING-SCIENCE-MECHATRONIC-2026": "AU",
    "umanitoba-ece-msc-thesis": "CA",
    "uwaterloo-ece-masc-research": "CA",
    "de-tum-robotics-cognition-intelligence": "DE",
    "de-tum-mechatronics-robotics-biomechanical-engineering": "DE",
    "de-tu-berlin-electrical-engineering": "DE",
    "de-tu-berlin-computer-engineering": "DE",
    "de-haw-hamburg-automation-technology": "DE",
    "de-hsd-electrical-engineering-information-technology": "DE",
    "tu-dortmund-automation-robotics": "DE",
    "tu-dresden-nanoelectronic-systems": "DE",
    "uni-due-automation-safety": "DE",
    "fau-autonomy-technologies": "DE",
    "gb-bristol-robotics-msc": "GB",
    "gb-southampton-robotics-autonomous-systems-msc": "GB",
    "PL-PWR-CONTROL-ROBOTICS-EMBEDDED-2026": "PL",
    "PL-WUT-ROBOTICS-AUTOMATIC-CONTROL-2026": "PL",
    "cornell-ece-meng-ithaca": "US",
    "cornell-robotics-phd-mae": "US"
  },
  "funding": {
    "waterloo-published-minimum-conditional": {
      "program": "uwaterloo-ece-masc-research",
      "award": 18000
    },
    "cornell-12-month-package-hypothesis": {
      "program": "cornell-robotics-phd-mae",
      "award": 48912
    },
    "cornell-15-percent-receipt-stress": {
      "program": "cornell-robotics-phd-mae",
      "award": 41575.2
    }
  }
};
