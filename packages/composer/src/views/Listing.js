/* eslint react/forbid-prop-types: 0 */
import css from "styled-components";
import React from "react";
import { arrayOf, func, object, shape, string } from "prop-types";

import {
  Action,
  Container,
  PageTitle,
  Separator,
  Stories,
  Story,
  UserMenu,
  color,
  setHeight
} from "interviewjs-styleguide";
import { CreateStoryModal } from "../modals";

const Page = css.div`
  align-content: stretch;
  align-items: stretch;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
`;

const PageHead = css.div`
  align-items: center;
  background: ${color.greyWt};
  display: flex;
  flex-direction: row;
  flex: 1 0 auto;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 5;
  &:after {
    ${setHeight("m")};
    background: linear-gradient(${color.greyWt}, rgba(247, 247, 247, 0));
    content: ' ';
    left: 0;
    position: absolute;
    right: 0;
    top: 100%;s
    width: 100%;
  }
`;

const PageBody = css.div`
`;

export default class Listing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { createStoryModal: false };
    this.toggleCreateStoryModal = this.toggleCreateStoryModal.bind(this);
  }
  toggleCreateStoryModal() {
    this.setState({ createStoryModal: !this.state.createStoryModal });
  }
  render() {
    return [
      <Page key="Page">
        <PageHead>
          <Container flex={[1, 1, `${100 / 3}%`]} padded>
            <UserMenu data={this.props.user} />
          </Container>
          <Container flex={[1, 1, `${100 / 3}%`]} align="center" padded>
            <PageTitle typo="h1">Your Stories</PageTitle>
          </Container>
          <Container flex={[1, 1, `${100 / 3}%`]} align="right" padded>
            <Action primary onClick={() => this.toggleCreateStoryModal()}>
              Create new
            </Action>
          </Container>
        </PageHead>
        <Separator effect="silent" size="h" />
        <PageBody>
          <Container limit="l">
            <Stories>
              {this.props.stories.map((story, i) => (
                <Story
                  data={story}
                  handleDelete={() => this.props.deleteStory(i)}
                  handleOpen={() =>
                    this.props.router.push(`stories/${story.id}`)
                  }
                  i={i}
                  key={story.id}
                />
              ))}
            </Stories>
          </Container>
        </PageBody>
      </Page>,
      <CreateStoryModal
        handleClose={this.toggleCreateStoryModal}
        handleCreateStory={this.props.createStory}
        isOpen={this.state.createStoryModal}
        key="CreateStoryModal"
      />
    ];
  }
}

Listing.propTypes = {
  createStory: func,
  deleteStory: func,
  router: object,
  stories: arrayOf(object),
  user: shape({
    name: string,
    id: string,
    avatar: string
  })
};

Listing.defaultProps = {
  createStory: null,
  deleteStory: null,
  stories: [],
  user: {},
  router: null
};
