import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Icon } from 'antd';
import ColumnCheck from './ColumnCheck';
import Search from './Search';


class Header extends Component {
  constructor(props) {
    super(props);
  }

  resolveTableOperation() {
    const { tableOperation, noOperation } = this.props;
    if (typeof tableOperation === 'function') {
      return tableOperation();
    } else if (Array.isArray(tableOperation)) {
      return tableOperation.map((op, i) => {
        let operation = op;
        if (typeof operation === 'function') {
          operation = operation();
          if (React.isValidElement(operation)) {
            return React.cloneElement(operation, {
              key: `@table/op${i}`,
              className: `${operation.className || ''} tableActionButton`,
            });
          }
        }
        if (typeof operation === 'string') {
          return this.defaultTableOperation([operation]);
        }
      })
    } else {
      return this.defaultTableOperation(['create', 'columnCheck'].filter(ac => noOperation[`no${ac[0].toUpperCase()}${ac.slice(1)}`] !== true))
    }
  }

  defaultTableOperation(operations) {
    const { columnCheckConfig } = this.props;
    return operations.map(operation => {
      if ('columnCheck' === operation) {
        return <ColumnCheck key="@table/columnCheck" { ...columnCheckConfig } />;
      } else if ('create' === operation) {
        return (
          <Button key="@table/add" className="tableActionButton" onClick={() => {
            this.context._t.showEdit({});
          }}>
            <Icon type="plus" />
          </Button>
        )
      }
    });
  }

  render() {
    const { searchConfig: formOption } = this.props;

    return (
      <div style={{marginBottom: 10}}>
        <Row className="headerRow">
          <Col className="flexCol">
            <Search formOption={formOption} />
          </Col>
          <Col className="headerRowAction">
            {this.resolveTableOperation()}
          </Col>
        </Row>
      </div>
    );
  }
}

Header.contextTypes = {
  _t: PropTypes.object
};

export default Header;