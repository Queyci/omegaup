<template>
  <div>
    <ul class="nav justify-content-center nav-tabs" role="tablist">
      <li class="nav-item" v-for="tab in availableTabs">
        <a
          href="#"
          class="nav-link"
          data-toggle="tab"
          role="tab"
          v-bind:aria-controls="tab.name"
          v-bind:class="{ active: selectedTab === tab.name }"
          v-bind:aria-selected="selectedTab === tab.name"
          v-on:click="selectedTab = tab.name"
        >
          {{ tab.text }}
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <div
        class="tab-pane fade p-4"
        v-bind:class="{ 'show active': selectedTab === 'problems' }"
      >
        <h3 class="text-center mb-4">
          {{ problem.title }}
          <img
            src="/media/quality-badge-sm.png"
            v-bind:title="T.wordsHighQualityProblem"
            v-if="problem.quality_seal || problem.visibility === 3"
          />
          <font-awesome-icon
            v-if="problem.visibility === 1 || problem.visibility === -1"
            v-bind:icon="['fas', 'exclamation-triangle']"
            v-bind:tiitle="T.wordsWarningProblem"
          />
          <font-awesome-icon
            v-if="problem.visibility === 0 || problem.visibility === -1"
            v-bind:icon="['fas', 'eye-slash']"
            v-bind:title="T.wordsPrivate"
          />
          <font-awesome-icon
            v-if="problem.visibility <= -2"
            v-bind:icon="['fas', 'ban']"
            v-bind:title="T.wordsBannedProblem"
            color="darkred"
          />
          <a v-if="user.admin" v-bind:href="`/problem/${problem.alias}/edit/`">
            <font-awesome-icon v-bind:icon="['fas', 'edit']" />
          </a>
        </h3>
        <table class="table table-bordered mx-auto w-75 mb-0">
          <tr>
            <td class="align-middle">{{ T.wordsPoints }}</td>
            <td class="align-middle">{{ problem.points }}</td>
            <td class="align-middle">{{ T.wordsMemoryLimit }}</td>
            <td class="align-middle">{{ problem.limits.memory_limit }}</td>
          </tr>
          <tr>
            <td class="align-middle">{{ T.wordsTimeLimit }}</td>
            <td class="align-middle">{{ problem.limits.time_limit }}</td>
            <td class="align-middle">{{ T.wordsOverallWallTimeLimit }}</td>
            <td class="align-middle">
              {{ problem.limits.overall_wall_time_limit }}
            </td>
          </tr>
          <tr>
            <td class="align-middle">{{ T.problemEditFormInputLimit }}</td>
            <td class="align-middle">{{ problem.limits.input_limit }}</td>
          </tr>
        </table>

        <div class="karel-js-link my-3" v-if="problem.karel_problem">
          <a
            class="p-3"
            v-bind:href="
              `/karel.js/${
                problem.sample_input ? `#mundo:${problem.sample_input}` : ''
              }`
            "
            target="_blank"
          >
            {{ T.openInKarelJs }}
            <font-awesome-icon v-bind:icon="['fas', 'external-link-alt']" />
          </a>
        </div>

        <div class="mt-4 markdown">
          <omegaup-markdown
            v-bind:markdown="problem.statement.markdown"
            v-bind:image-mapping="problem.statement.images"
            v-bind:problem-settings="problem.settings"
          ></omegaup-markdown>
        </div>
        <hr class="my-3" />
        <div class="font-italic">
          {{ `${T.wordsSource}: ${problem.source}` }}
        </div>
        <template v-if="problem.problemsetter">
          <div>
            {{ T.wordsProblemsetter }}:
            <omegaup-username
              v-bind:classname="problem.problemsetter.classname"
              v-bind:username="problem.problemsetter.username"
              v-bind:linkify="true"
            ></omegaup-username>
          </div>
          <div>
            {{
              UI.formatString(T.wordsUploadedOn, {
                date: time.formatDate(problem.problemsetter.creation_date),
              })
            }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../../sass/main.scss';

table td {
  padding: 0.5rem;
}

.karel-js-link {
  border: 1px solid #eee;
  border-left: 0;
  border-radius: 3px;

  a {
    border-left: 5px solid #1b809e;
    display: block;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { types } from '../../api_types';
import T from '../../lang';
import * as time from '../../time';
import * as UI from '../../ui';

import user_Username from '../user/Username.vue';
import omegaup_Markdown from '../Markdown.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faEdit,
  faExclamationTriangle,
  faEyeSlash,
  faBan,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faExclamationTriangle,
  faEdit,
  faEyeSlash,
  faBan,
  faExternalLinkAlt,
);

interface Tab {
  name: string;
  text: string;
}

@Component({
  components: {
    FontAwesomeIcon,
    'omegaup-markdown': omegaup_Markdown,
    'omegaup-username': user_Username,
  },
})
export default class ProblemDetails extends Vue {
  @Prop() problem!: types.ProblemInfo;
  @Prop() user!: types.UserInfoForProblem;
  @Prop() nominationStatus!: types.NominationStatus;

  T = T;
  UI = UI;
  time = time;
  selectedTab = 'problems';

  get availableTabs(): Tab[] {
    let tabs = [
      {
        name: 'problems',
        text: T.wordsProblem,
      },
    ];
    return tabs;
  }
}
</script>
