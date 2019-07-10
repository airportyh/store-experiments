import { Store, StoreMiddleware } from "./utility/store";
import * as _ from "lodash";
import * as util from "util";

const workplans = [
  { ID: 1, Title: "Laundry", TaskStatus: "In Progress", CompletePercent: 0.5 },
  { ID: 2, Title: "Water Plants", TaskStatus: "Not Started", CompletePercent: 0 }
];

type FormUpdate = {
  autofill?: any;
}

const viewModels = workplans.map((workplan) => {
  return {
    id: workplan.ID,
    model: workplan,
    updatedModel: {},
    uiSettings: {
      editing: false,
      deleting: false,
      fields: {
        ID: {
          isRequired: true
        },
        Title: {
          isRequired: true
        }
      }
    }
  }
});

const metastoreMiddleware: StoreMiddleware = (update, data) => {
  const path = update.path;
  if (path.length === 3) {
    const [id, viewModelProp, field] = path;
    if (viewModelProp === "updatedModel") {
      return validationRules.reduce((updates, rule) => {
        const formUpdate = rule(field, update.newValue);
        if (formUpdate && formUpdate.autofill) {
          return [
            ...updates,
            {
              path: [id, "updatedModel", formUpdate.field],
              newValue: formUpdate.autofill
            }
          ];
        } else {
          return updates;
        }
      }, []);
    }
  }
  return [];
};

// const completeRule: StoreMiddleware = (update, data) => {
//   const path = update.path;
//   if (path.length === 3) {
//     const [id, viewModelProp, field] = path;
//     if (viewModelProp === "updatedModel") {
//       if (field === "TaskStatus" && update.newValue === "Complete") {
//         return [{
//           path: [id, viewModelProp, "PercentComplete"],
//           newValue: 1
//         }];
//       }
//     }
//   }
//   return [];
// };

// const inverseCompleteRule: StoreMiddleware = (update, data) => {
//   const path = update.path;
//   if (path.length === 3) {
//     const [id, viewModelProp, field] = path;
//     if (viewModelProp === "updatedModel") {
//       if (field === "PercentComplete" && update.newValue === 1) {
//         return [{
//           path: [id, viewModelProp, "TaskStatus"],
//           newValue: "Complete"
//         }];
//       }
//     }
//   }
//   return [];
// };

const validationRules = [
  (field, value): _.Dictionary<FormUpdate> => {
    if (field === "PercentComplete" && value === 1) {
      return {
        TaskStatus: {
          autofill: "Complete"
        }
      };
    }
  },
  (field, value): _.Dictionary<FormUpdate> => {
    if (field === "TaskStatus" && value === "Complete") {
      return {
        PercentComplete: {
          autofill: 1
        }
      };
    }
  }
]

const middleware = [
  metastoreMiddleware
];

const store = new Store(_.keyBy(viewModels, "id"), middleware);

store.get().subscribe((data) => {
  console.log("subscriber got", util.inspect(data, { depth: 10 }));
});

store.set(["1", "updatedModel", "TaskStatus"], "Complete");
