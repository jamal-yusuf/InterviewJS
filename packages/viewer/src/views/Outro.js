/* eslint react/forbid-prop-types: 0 */
import css from "styled-components";
import React, { Component } from "react";
import { object, shape, string } from "prop-types";

import {
  Action,
  Actionbar,
  Container,
  PageParagraph,
  PageSubtitle,
  PageTitle,
  Separator,
  color,
  setSpace
} from "interviewjs-styleguide";

import { Cover, Topbar } from "../partials";

const Page = css.div`
  background: ${color.black};
  color: ${color.white};
  min-height: 100vh;
  min-width: 100vw;
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const PageHead = css(Container)`
  ${setSpace("pbl")};
  width: 100%;
`;

const PageBody = css(Container)`
  ${setSpace("phl")};
  ${setSpace("pbl")};
  width: 100%;
`;

const PageFoot = css(Container)`
  ${setSpace("phl")};
  ${setSpace("pbl")};
`;

const Aside = css(PageParagraph)`
  color: ${color.flareHD};
`;

export default class OutroView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { story } = this.props;
    return [
      <Topbar
        handleDetails={() => this.props.router.push(`/details`)}
        handleBack={() => this.props.router.push(`/listing`)}
        key="topbar"
      />,
      <Page key="page">
        <PageHead flex={[0, 1, `${100 / 2}%`]}>
          <Cover image={story.cover} />
        </PageHead>
        <PageBody limit="m" flex={[1, 0, `${100 / 4}%`]}>
          <Container limit="x">
            <PageSubtitle typo="h3">
              Wow, you are truly curious! You have spoken to everyone and
              collected 97% of the information. The world needs more people like
              you and we can’t wait to hear what you have to say!
            </PageSubtitle>
          </Container>
        </PageBody>
        <PageFoot limit="m" flex={[1, 0, `${100 / 4}%`]}>
          <Actionbar>
            <Action
              fixed
              onClick={() => this.props.router.push(`/listing`)}
              primary
            >
              Revisit the interviews
            </Action>
            <Action
              fixed
              onClick={() => this.props.router.push(`/poll`)}
              primary
            >
              Have your say
            </Action>
          </Actionbar>
        </PageFoot>
      </Page>
    ];
  }
}

OutroView.propTypes = {
  router: object,
  story: shape({
    title: string
  })
};

OutroView.defaultProps = {
  router: null,
  story: {}
};
