import React, { Component } from "react";
import PropTypes from "prop-types";
import { decodeGetParams, encodeGetParams } from "../global/functions";

const PaginationContext = React.createContext();

class PaginationProvider extends Component {
  // -----------------Methods-------------------

  paginate = async params => {
    const { fetchData } = this.props;
    const search = encodeGetParams(params);

    this.setState({ isLoading: true });
    const { data, count } = await fetchData(search);
    this.setState({ data, count, isLoading: false });
  };

  setParams = params => this.setState({ params });

  parseURLParamsAndAddPage = () => {
    const { location } = this.props;
    const params = decodeGetParams(location.search);

    return { ...params, page: params.page ? Number(params.page) : 1 };
  };

  // ----------------Lifecycle------------------

  componentDidMount = () => {
    const {
      location: { search }
    } = this.props;
    const newParams = this.parseURLParamsAndAddPage(search);

    this.setParams(newParams);
    this.paginate(newParams);
  };

  componentDidUpdate = prevProps => {
    const {
      location: { search }
    } = this.props;
    const { params: prevParams } = this.state;
    const newParams = this.parseURLParamsAndAddPage(search);

    const paramsHasChanged = prevProps.location.search !== search;
    if (paramsHasChanged) this.setParams(newParams);

    const pageHasChanged = prevParams.page !== newParams.page;
    if (pageHasChanged) this.paginate(newParams);
  };

  // -------------------------------------------

  state = {
    data: [],
    params: {
      page: 1
    },
    count: 1,
    isLoading: true
  };

  render = () => (
    <PaginationContext.Provider value={{ ...this.props, ...this.state }}>
      {this.props.children}
    </PaginationContext.Provider>
  );
}

const PaginationConsumer = PaginationContext.Consumer;

export { PaginationProvider, PaginationConsumer };

PaginationProvider.propTypes = {
  fetchData: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  pathname: PropTypes.string,
  search: PropTypes.string
};
