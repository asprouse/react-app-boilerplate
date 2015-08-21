import Router from 'react-router';

function getRouteName(branch) {
  return branch[branch.length - 1].name;
}

function run(routes, location) {
  return new Promise((resolve, reject) => {
    Router.run(routes, location, (error, initialState, transition) => {
      if (error) {
        reject(error);
      } else {
        const routeName = getRouteName(initialState.branch);
        resolve({ initialState, transition, routeName });
      }
    });
  });
}

export default { run };
