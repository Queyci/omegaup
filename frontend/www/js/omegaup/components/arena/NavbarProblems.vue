<template>
  <div class="problem-list">
    <div class="active" data-breadcrumbs v-if="inAssignment">
      <span>
        <a class="breadcrumbs-link" href="/course/">{{ T.navCourses }}</a> >
        <a class="breadcrumbs-link" v-bind:href="urlAssignment">{{
          courseName
        }}</a>
        <template v-if="currentAssignment">
          > <span class="breadcrumbs-link">{{ currentAssignment.name }}</span>
        </template>
      </span>
    </div>
    <div class="summary" v-bind:class="{ active: !activeProblem }">
      <a class="name" href="#problems">{{ T.wordsSummary }}</a>
    </div>
    <div
      v-bind:class="{ active: problem.alias === activeProblem }"
      v-for="problem in problems"
    >
      <div class="row">
        <div class="col-xs-5 problem-type">
          <span v-if="inAssignment">{{
            getProblemTypeTitle(problem.acceptsSubmissions)
          }}</span>
        </div>
        <div class="col-xs-7 solved" v-if="problem.acceptsSubmissions">
          <span
            >({{
              parseFloat(problem.bestScore).toFixed(digitsAfterDecimalPoint)
            }}
            /
            {{
              parseFloat(problem.maxScore).toFixed(digitsAfterDecimalPoint)
            }})</span
          >
          <font-awesome-icon
            icon="check"
            v-bind:style="{ color: 'green' }"
            v-if="problem.bestScore == problem.maxScore"
          />
          <font-awesome-icon
            icon="times"
            v-bind:style="{ color: 'red' }"
            v-else-if="problem.hasRuns"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <a class="name" v-on:click="onNavigateToProblem(problem)">{{
            problem.text
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.problem-list .breadcrumbs-link {
  display: inherit;
}

.problem-list > div {
  width: 19em;
  margin-bottom: 0.5em;
  padding-top: 0.2em;
  background: #ddd;
  border: solid 1px #ccc;
  border-width: 1px 0 1px 1px;
  position: relative;
}

.problem-list > div a {
  color: #5588dd;
  display: block;
  padding: 0.5em;
  width: 100%;
}

.problem-list > div.active {
  background: white;
}

.problem-list > div.summary {
  margin-bottom: 1em;
}

.problem-list > div .solved {
  text-align: right;
  right: 1em;
}

.problem-list .problem-type {
  font-size: 13px;
  color: #9a9a9a;
  font-weight: bold;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { omegaup } from '../../omegaup';
import T from '../../lang';

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(fas);

@Component({
  components: {
    'font-awesome-icon': FontAwesomeIcon,
    'font-awesome-layers': FontAwesomeLayers,
    'font-awesome-layers-text': FontAwesomeLayersText,
  },
})
export default class ArenaNavbarProblems extends Vue {
  @Prop() problems!: omegaup.ContestProblem[];
  @Prop() activeProblem!: string | null;
  @Prop() courseAlias!: string | null;
  @Prop() courseName!: string | null;
  @Prop() inAssignment!: boolean;
  @Prop({ default: 2 }) digitsAfterDecimalPoint!: number;
  @Prop({ default: null }) currentAssignment!: omegaup.Assignment | null;

  T = T;

  getProblemTypeTitle(acceptsSubmissions: boolean): string {
    return acceptsSubmissions ? T.wordsProblem : T.wordsLecture;
  }

  get urlAssignment(): string {
    return `/course/${this.courseAlias}/`;
  }

  onNavigateToProblem(problem: omegaup.ContestProblem) {
    this.$emit('navigate-to-problem', problem.alias);
  }
}
</script>
