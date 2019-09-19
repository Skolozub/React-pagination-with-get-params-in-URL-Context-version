import React from "react";
import axios from "axios";
import {
  PaginationProvider,
  PaginationConsumer
} from "../containers/pagination-provider";
import { List } from "../components/list";
import { Pagination } from "../components/pagination";
import { H1 } from "../components/h1";
import { Content } from "../components/content";

export const Users = props => {
  const fetchUsers = async query => {
    const {
      data: { count, results }
    } = await axios.get(`/people${query}`);

    return { data: results, count: Math.ceil(count / 10) };
  };

  return (
    <Content>
      <H1>Users</H1>

      <PaginationProvider {...props} fetchData={fetchUsers}>
        <PaginationConsumer>
          {values => (
            <>
              <Pagination {...values} />
              <List {...values} />
              <Pagination {...values} />
            </>
          )}
        </PaginationConsumer>
      </PaginationProvider>
    </Content>
  );
};
