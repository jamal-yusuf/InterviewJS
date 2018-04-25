/* eslint react/forbid-prop-types: 0 */
import React, { Component } from "react";
import { object, shape, string, func } from "prop-types";
import axios from "axios";
import { flatten, filter } from "lodash";

import {
  Action,
  Actionbar,
  PageSubtitle,
  Separator
} from "interviewjs-styleguide";

import {
  Cover,
  Page,
  PageBody,
  PageHead,
  StoryDetailsModal,
  Topbar
} from "../partials";

export default class OutroView extends Component {
  constructor(props) {
    super(props);
    this.state = { storyDetailsModal: false };
    this.getScore = this.getScore.bind(this);
    this.toggleDetailsModal = this.toggleDetailsModal.bind(this);
  }

  componentDidMount() {
    // I'm framed, wait for message with JSON that looks like a story -- FIXME
    if (window.top !== window && window.addEventListener) {
      window.addEventListener(
        "message",
        ({ data, origin, source }) => {
          console.log(origin, data, source);
          if (data.interviewees) this.props.createStory(data);
        },
        false
      );
    }

    // Load story via storyId -> getStoryURL
    if (
      (!this.props.story || Object.keys(this.props.story).length === 0) &&
      this.props.params.storyId &&
      window.InterviewJS &&
      window.InterviewJS.getStoryURL
    ) {
      const storyURL = window.InterviewJS.getStoryURL(
        this.props.params.storyId
      );
      if (storyURL)
        axios
          .get(storyURL)
          .then((response) => this.props.createStory(response.data));
    }
  }

  getScore() {
    const { story } = this.props;
    const { interviewees } = story;

    // construct array out of scripted storylines
    const storylines = [];
    interviewees.forEach((interviewee) =>
      storylines.push(interviewee.storyline)
    );

    // construct array out of localstorage histories
    const histories = [];
    interviewees.forEach((interviewee) => {
      const localHistory = JSON.parse(
        localStorage.getItem(
          `history-${story.id}-${story.version}-${interviewee.id}`
        )
      );
      return localHistory ? histories.push(localHistory) : null;
    });

    // count only interviewees’ items
    const getScoreItemsCount = (arr) =>
      filter(flatten(arr), (o) => o.role === "interviewee").length;

    // start counting
    const total = getScoreItemsCount(storylines);
    const local = getScoreItemsCount(histories);
    const score = Math.round(local * 100 / total);

    return score;
  }

  toggleDetailsModal() {
    this.setState({ storyDetailsModal: !this.state.storyDetailsModal });
  }

  render() {
    this.getScore();
    const { story } = this.props;
    if (!story || Object.keys(story).length === 0) return null; // FIXME show spinner

    const resultScore = this.getScore();
    const getResultScore = () => {
      if (resultScore >= 95) {
        return `Well done, you have explored the maximum amount of information possible.
        Would you like to have your say now?`;
      } else if (resultScore >= 70) {
        return `Nice one, you have explored ${resultScore}% of the story. Go back to the interviews for more or have your say now.`;
      } else if (resultScore >= 50) {
        return `You have explored ${resultScore}% of the story, you can revisit the interviews at any time or have your say now.`;
      } else if (resultScore >= 25) {
        return `You have explored ${resultScore}% of the story, but there is plenty more to find out, you can revisit the interviews at any time or have your say now.`;
      }
      return `Were you in a rush? You have explored ${resultScore}% of the information, but there is plenty more to find out, you can revisit the interviews at any time or have your say now.`;
    };
    return [
      <Topbar
        handleDetails={this.toggleDetailsModal}
        handleBack={() => this.props.router.push(`/${story.id}/listing`)}
        key="topbar"
      />,
      <Page key="page">
        <PageHead flex={[0, 1, `${100 / 2}%`]}>
          <Cover image={story.cover} compact />
        </PageHead>
        <PageBody limit="x" flex={[1, 0, `${100 / 2}%`]}>
          <PageSubtitle typo="h3">{getResultScore()}</PageSubtitle>
          <Separator size="l" silent />
          <Actionbar>
            <Action
              fixed
              onClick={() => this.props.router.push(`/${story.id}/listing`)}
              primary
            >
              Revisit the interviews
            </Action>
            <Action
              fixed
              onClick={() => this.props.router.push(`/${story.id}/poll`)}
              primary
            >
              Have your say
            </Action>
          </Actionbar>
        </PageBody>
      </Page>,
      this.state.storyDetailsModal ? (
        <StoryDetailsModal
          handleClose={this.toggleDetailsModal}
          isOpen={this.state.storyDetailsModal}
          key="detailsModal"
          story={story}
        />
      ) : null
    ];
  }
}

OutroView.propTypes = {
  createStory: func.isRequired,
  router: object,
  params: object,
  story: shape({
    title: string
  })
};

OutroView.defaultProps = {
  router: null,
  params: {},
  story: {}
};
