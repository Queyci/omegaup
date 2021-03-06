import Vue from 'vue';
import { OmegaUp } from '../omegaup';
import T from '../lang';
import * as api from '../api';
import * as ui from '../ui';
import { types } from '../api_types';

import problem_Solution from '../components/problem/Solution.vue';

OmegaUp.on('ready', () => {
  const payload = types.payloadParsers.ProblemDetailsPayload();
  const problemSolution = new Vue({
    el: '#problem-solution',
    render: function(createElement) {
      return createElement('omegaup-problem-solution', {
        props: {
          status: this.status,
          solution: this.solution,
          allTokens: this.allTokens,
          availableTokens: this.availableTokens,
        },
        on: {
          'unlock-solution': () => {
            api.Problem.solution({
              problem_alias: payload.alias,
              forfeit_problem: true,
            })
              .then(data => {
                if (!data.exists || !data.solution) {
                  ui.error(T.wordsProblemOrSolutionNotExist);
                  return;
                }
                problemSolution.status = 'unlocked';
                problemSolution.solution = data.solution;
                ui.info(
                  ui.formatString(T.solutionTokens, {
                    available: problemSolution.availableTokens - 1,
                    total: problemSolution.allTokens,
                  }),
                );
              })
              .catch(ui.apiError);
          },
          'get-tokens': () => {
            api.ProblemForfeited.getCounts()
              .then(data => {
                problemSolution.allTokens = data.allowed;
                problemSolution.availableTokens = data.allowed - data.seen;
                if (problemSolution.availableTokens <= 0) {
                  ui.warning(T.solutionNoTokens);
                }
              })
              .catch(ui.apiError);
          },
          'get-solution': () => {
            if (payload.solution_status === 'unlocked') {
              api.Problem.solution({ problem_alias: payload.alias })
                .then(data => {
                  if (!data.exists || !data.solution) {
                    return;
                  }
                  problemSolution.solution = data.solution;
                })
                .catch(ui.apiError);
            }
          },
        },
      });
    },
    data: {
      status: payload.solution_status || 'not_logged_in',
      solution: <types.ProblemStatement | null>null,
      allTokens: 0,
      availableTokens: 0,
    },
    components: {
      'omegaup-problem-solution': problem_Solution,
    },
  });
});
