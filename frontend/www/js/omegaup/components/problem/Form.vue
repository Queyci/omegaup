<template>
  <div class="card problem-form">
    <div class="card-header" v-if="!isUpdate">
      <h3 class="card-title">
        {{ T.problemNew }}
      </h3>
    </div>
    <div class="page-header text-center top-margin">
      <p class="no-bottom-margin">
        {{ T.problemEditFormFirstTimeCreatingAProblem }}
        <strong>
          <a v-bind:href="howToWriteProblemLink" target="_blank">
            {{ T.problemEditFormHereIsHowToWriteProblems }}
          </a>
        </strong>
      </p>
    </div>
    <div class="card-body">
      <form
        method="POST"
        class="form"
        enctype="multipart/form-data"
        v-on:submit="onSubmit"
      >
        <div class="row">
          <div
            class="form-group  col-md-6"
            v-bind:class="{ 'has-error': errors.includes('title') }"
          >
            <label class="control-label">{{ T.wordsTitle }}</label>
            <input
              name="title"
              v-model="title"
              type="text"
              class="form-control"
              v-on:blur="onGenerateAlias"
            />
          </div>

          <div
            class="form-group  col-md-6"
            v-bind:class="{ 'has-error': errors.includes('alias') }"
          >
            <label class="control-label">{{ T.wordsAlias }}</label>
            <input
              name="alias"
              v-model="alias"
              ref="alias"
              type="text"
              class="form-control"
              v-bind:disabled="isUpdate"
            />
          </div>
        </div>

        <omegaup-problem-settings
          v-bind:timeLimit="timeLimit"
          v-bind:extraWallTime="extraWallTime"
          v-bind:memoryLimit="memoryLimit"
          v-bind:outputLimit="outputLimit"
          v-bind:inputLimit="inputLimit"
          v-bind:initialValidator="validator"
          v-bind:initialLanguage="languages"
          v-bind:overallWallTimeLimit="overallWallTimeLimit"
          v-bind:validatorTimeLimit="validatorTimeLimit"
          v-bind:validLanguages="data.validLanguages"
          v-bind:validatorTypes="data.validatorTypes"
        ></omegaup-problem-settings>

        <div class="row">
          <div class="form-group col-md-6">
            <label>{{ T.problemEditEmailClarifications }}</label>
            <div class="form-control">
              <label class="radio-inline">
                <input
                  type="radio"
                  name="email_clarifications"
                  v-bind:value="true"
                  v-model="emailClarifications"
                />
                {{ T.wordsYes }}
              </label>
              <label class="radio-inline">
                <input
                  type="radio"
                  name="email_clarifications"
                  v-bind:value="false"
                  v-model="emailClarifications"
                />
                {{ T.wordsNo }}
              </label>
            </div>
          </div>

          <div class="form-group col-md-6">
            <label>{{ T.problemEditFormAppearsAsPublic }}</label>
            <div class="form-control">
              <label class="radio-inline">
                <input
                  type="radio"
                  name="visibility"
                  v-bind:disabled="!isEditable"
                  v-bind:value="true"
                  v-model="isPublic"
                />
                {{ T.wordsYes }}
              </label>
              <label class="radio-inline">
                <input
                  type="radio"
                  name="visibility"
                  v-bind:disabled="!isEditable"
                  v-bind:value="false"
                  v-model="isPublic"
                />
                {{ T.wordsNo }}
              </label>
            </div>
          </div>
        </div>

        <div class="row">
          <div
            class="form-group  col-md-6"
            v-bind:class="{ 'has-error': errors.includes('source') }"
          >
            <label class="control-label">{{ T.problemEditSource }}</label>
            <input
              name="source"
              v-model="source"
              type="text"
              class="form-control"
            />
          </div>

          <div
            class="form-group col-md-6"
            v-bind:class="{ 'has-error': errors.includes('file') }"
          >
            <label class="control-label">{{ T.problemEditFormFile }}</label>
            <a v-bind:href="howToWriteProblemLink" target="_blank">
              <span>{{ T.problemEditFormHowToWriteProblems }}</span>
            </a>
            <input
              name="problem_contents"
              type="file"
              class="form-control"
              v-on:change="onUploadFile"
            />
          </div>
        </div>

        <omegaup-problem-tags
          v-bind:initialTags="data.tags"
          v-bind:initialSelectedTags="data.selectedTags || []"
          v-bind:alias="data.alias"
          v-if="!isUpdate"
        ></omegaup-problem-tags>
        <div class="row" v-else="">
          <div
            class="form-group  col-md-12"
            v-bind:class="{ 'has-error': errors.includes('message') }"
          >
            <label class="control-label">{{
              T.problemEditCommitMessage
            }}</label>
            <input
              class="form-control"
              name="message"
              v-model="message"
              type="text"
            />
          </div>
        </div>

        <input
          type="hidden"
          name="visibility"
          v-bind:value="visibility"
          v-if="isEditable"
        />
        <input name="request" value="submit" type="hidden" />

        <div class="row">
          <div class="form-group col-md-6 no-bottom-margin">
            <button type="submit" class="btn btn-primary">
              {{ buttonText }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.problem-form .languages {
  padding: 0;
  width: 100%;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import problem_Settings from './Settings.vue';
import problem_Tags from './Tags.vue';
import T from '../../lang';
import * as ui from '../../ui';
import latinize from 'latinize';
import { types } from '../../api_types';

@Component({
  components: {
    'omegaup-problem-settings': problem_Settings,
    'omegaup-problem-tags': problem_Tags,
  },
})
export default class ProblemForm extends Vue {
  @Prop() data!: types.ProblemFormPayload;
  @Prop({ default: false }) isUpdate!: boolean;
  @Prop({ default: 0 }) originalVisibility!: number;

  T = T;
  title = this.data.title;
  alias = this.data.alias;
  timeLimit = this.data.timeLimit;
  extraWallTime = this.data.extraWallTime;
  memoryLimit = this.data.memoryLimit;
  outputLimit = this.data.outputLimit;
  inputLimit = this.data.inputLimit;
  overallWallTimeLimit = this.data.overallWallTimeLimit;
  validatorTimeLimit = this.data.validatorTimeLimit;
  emailClarifications = this.data.emailClarifications;
  visibility = this.data.visibility;
  allowUserAddTags = this.data.allowUserAddTags;
  source = this.data.source;
  validator = this.data.validator;
  languages = this.data.languages;
  tags = this.data.tags;
  selectedTags = this.data.selectedTags || [];
  message = '';
  hasFile = false;
  public = false;
  errors: string[] = [];

  get howToWriteProblemLink(): string {
    return 'https://github.com/omegaup/omegaup/wiki/C%C3%B3mo-escribir-problemas-para-Omegaup';
  }

  get buttonText(): string {
    if (this.isUpdate) {
      return T.problemEditFormUpdateProblem;
    }
    return T.problemEditFormCreateProblem;
  }

  get selectedTagsList(): string {
    return JSON.stringify(this.selectedTags);
  }

  get isPublic(): boolean {
    // when visibility is public warning, then the problem is shown as public
    return this.visibility > this.data.visibilityStatuses.private;
  }

  set isPublic(isPublic: boolean) {
    if (
      this.originalVisibility === this.data.visibilityStatuses.publicWarning ||
      this.originalVisibility === this.data.visibilityStatuses.privateWarning
    ) {
      this.visibility = isPublic
        ? this.data.visibilityStatuses.publicWarning
        : this.data.visibilityStatuses.privateWarning;
      return;
    }
    if (
      this.originalVisibility === this.data.visibilityStatuses.publicBanned ||
      this.originalVisibility === this.data.visibilityStatuses.privateBanned
    ) {
      this.visibility = isPublic
        ? this.data.visibilityStatuses.publicBanned
        : this.data.visibilityStatuses.privateBanned;
      return;
    }
    this.visibility = isPublic
      ? this.data.visibilityStatuses.public
      : this.data.visibilityStatuses.private;
  }

  get isEditable(): boolean {
    return (
      this.data.visibilityStatuses.publicBanned < this.visibility &&
      this.visibility < this.data.visibilityStatuses.promoted
    );
  }

  onSubmit(e: Event): void {
    this.errors = [];
    if (this.isUpdate && this.message) {
      return;
    }
    if (this.title && this.alias && this.source && this.hasFile) {
      return;
    }
    ui.error(T.editFieldRequired);
    if (!this.title) {
      this.errors.push('title');
    }
    if (!this.alias) {
      this.errors.push('alias');
    }
    if (!this.source) {
      this.errors.push('source');
    }
    if (!this.isUpdate && !this.hasFile) {
      this.errors.push('file');
    }
    if (this.isUpdate && !this.message) {
      this.errors.push('message');
    }
    e.preventDefault();
  }

  onUploadFile(ev: InputEvent): void {
    const uploadedFile = <HTMLInputElement>ev.target;
    this.hasFile = uploadedFile.files !== null;
  }

  onAddTag(tagname: string, isPublic: boolean): void {
    this.selectedTags.push({ tagname: tagname, public: isPublic });
    this.tags = this.tags.filter((val, index, arr) => val.name !== tagname);
  }

  onRemoveTag(tagname: string): void {
    this.tags.push({ name: tagname });
    this.selectedTags = this.selectedTags.filter(
      (val, index, arr) => val.tagname !== tagname,
    );
  }

  onGenerateAlias(): void {
    if (this.isUpdate) {
      return;
    }

    // Remove accents
    let generatedAlias = latinize(this.title);

    // Replace whitespace
    generatedAlias = generatedAlias.replace(/\s+/g, '-');

    // Remove invalid characters
    generatedAlias = generatedAlias.replace(/[^a-zA-Z0-9_-]/g, '');

    generatedAlias = generatedAlias.substring(0, 32);

    this.alias = generatedAlias;
  }

  @Watch('alias')
  onValueChanged(newValue: string): void {
    if (this.isUpdate) {
      return;
    }
    this.$emit('alias-changed', newValue);
  }
}
</script>
