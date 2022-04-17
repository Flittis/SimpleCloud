import React, { useContext, useEffect, useState } from 'react'

import { Context } from './index.js'
import { observer } from 'mobx-react-lite'

function Main() {
    let { Service } = useContext(Context);

    return (
        <>
            <h1>{Service.user?.name}</h1>
        </>
    );
}

export default observer(Main);
