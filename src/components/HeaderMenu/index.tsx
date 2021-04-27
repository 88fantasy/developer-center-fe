import React, { useEffect, useState } from "react";
import styles from "@/components/HeaderMenu/index.less";
// @ts-ignore
import { history, Dispatch, connect, Link } from "umi";
import { Checkbox, Popover, Menu, Tooltip } from 'antd';
import * as _ from 'lodash';
import { message } from 'antd';
import menuIconsMap from './config';

const{SubMenu, Item} = Menu

type HeaderMenuProps = {
  menuData: [];
  dispatch: Dispatch;
  defaultPathName?: string;
}

const HeaderMenu: React.FC<HeaderMenuProps> = (props) => {
  const { dispatch } = props
  const [chooseMenus, setChooseMenus] = useState([] as any[])
  const [addMenuShow, setAddMenuShow] = useState(false)
  const [menuShow, setMenuShow] = useState(false)
  const [defaultChooseMenus, setDefaultChooseMenus] = useState([] as any[])
  const [renderData, setRenderData] = useState([]);

  // 初始化页面
  useEffect(() => {
    initData();
    if (!localStorage.getItem('auth')) {
      return
    }
    dispatch({
      type: `user/getNavMenuParam`,
      callback: (res) => {
        if (res && res.data) {
          const menus = JSON.parse(res.data)
          setDefaultChooseMenus(menus)
          setChooseMenus(menus)
        }
      }
    });
  }, [])

  const initData = () => {
    let originData = {}
    const getRenderData = (data, itemKey?, itemName?, itemIcon?) => [
      data.map(item => {
        const { name, children = [], hideInMenu = false, hideChildrenInMenu = false, key, icon, title } = item
        const finalKey = itemKey ? itemKey : key
        const finalName = itemName ? itemName : name;
        const finalIcon = itemIcon ? itemIcon : menuIconsMap[finalKey] ? <img src={menuIconsMap[finalKey]} className={styles.itemIcon} /> : icon
        if (name && !hideInMenu) {
          if (children.length && !hideChildrenInMenu) {
            getRenderData(children, finalKey, finalName, finalIcon)
          } else {
            if (originData[finalKey]) {
              originData[finalKey]['children'].push(item)
            } else {
              originData[finalKey] = {
                title: title,
                name: finalName,
                icon: finalIcon,
                children: [item]
              }
            }
          }
        }
      })
    ]
    getRenderData(props.menuData)
    const renderData = _.reduce(originData, (result, item) => {
      result.push(item)
      return result
    }, []);

    setRenderData(renderData)
  }

  // 提交快捷菜单信息
  const handleSaveMenu = () => {
    dispatch({
      type: `user/saveNavMenuParam`,
      payload: chooseMenus,
      callback: () => {
        setAddMenuShow(false)
        message.success({
          content: '修改成功',
          duration: 1,
          onClose: () => {
            location.reload();
          }
        });
      }
    });
  }

  const stopPropagtion = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  const handleCancel = () => {
    setAddMenuShow(false)
    setChooseMenus(defaultChooseMenus)
  }

  const handleMenuClick = (path) => {
    setMenuShow(false)
    history.push(path)
  }

  const renderMenus = () => {
    const node = getMenusNode(props.menuData)
    return (
      <Menu
        className={styles.headerMenuWrapper}
        theme="dark"
        mode="horizontal"
        selectedKeys={[]}
      >
        {node}
      </Menu>
    )
  }
  
  const getMenusNode = (data) => {
    return data.map((item) => {
      const { name, key: itemKey, children, path, hideChildrenInMenu = false, hideInMenu = false, } = item
      if (name && !hideInMenu) {
        if (children && children.length && !hideChildrenInMenu) {
          return getMenusNode(children)
        } else if (name && defaultChooseMenus.indexOf(itemKey) !== -1) {
          const _path = path.indexOf('/:') > -1 ? path.substring(0, path.indexOf('/:')) : path;
          const _isSelected = (props?.defaultPathName || '')?.indexOf(_path) > -1;
          return <Menu.Item className={_isSelected && styles.selectedMenu} key={path} onClick={() => { history.push(path) }}>{name}</Menu.Item>
        } else {
          return null
        }
      }
    }).filter(item => item)
  } 
  
  const renderDefaultMenus = () => {
    const node = getDefaultMenusNode(props.menuData)
    return (
      <Menu
        className={styles.headerMenuWrapper}
        theme="dark"
        mode="horizontal"
        selectedKeys={[]}
      >
        {node}
      </Menu>
    )
  }
  
  const getDefaultMenusNode = (data) => {
      const arr = data.filter(item => {
      return item.name === '新闻公告' || item.name === '账户中心' || item.name === '关于我们'
      })

      return arr.map(item => {
        const { name, children, hideInMenu = false, key} = item
        if (name && !hideInMenu) {
          if (children && children.length ) {
              const childNodes = children.map(childitem => {
              const { name, path, hideInMenu = false} = childitem
              if (children && children.length && !hideInMenu) {
                const _path = path.indexOf('/:') > -1 ? path.substring(0, path.indexOf('/:')) : path;
                const _isSelected = (props?.defaultPathName || '')?.indexOf(_path) > -1;
                return name && <Item className={_isSelected ? styles.selectedMenu : styles.hoverMenu} key={path} onClick={() => { history.push(path) }}><Link to={path}>{name}</Link></Item>
              }
            })
            return (
              <SubMenu key={key} title={name}>
                {childNodes}
              </SubMenu>
            )
          }
        }
      })
  }

  const handleChecked = (value) => {
    if (value.length > 6) {
      message.info('快捷菜单入口不可超过6个')
    } else {
      setChooseMenus(value)
    }
  }

  const renderShowPopup = (canEdit) => {
    const renderShowPopupContent = () => {
      return renderData.map((item, index) => {
        const { name, icon, children } = item;
        if(name !== '首页' && name !== '新闻公告' && name !== '账户中心' && name !== '关于我们'){
          return (
            <div key={index} className={styles.menuItemWrapper}>
              <div className={styles.menuItemHeader}>
                {icon}
                <span className={styles.menuItemHeaderName}>{name}</span>
              </div>
              <div className={styles.menuItemContent}>
                {
                  (children || []).map((childItem, childIndex) => {
                    const { key: childKey, name: childName, path } = childItem as any;
                    const _path = path.indexOf('/:') > -1 ? path.substring(0, path.indexOf('/:')) : path;
                    const _isSelected: boolean = (props?.defaultPathName || '')?.indexOf(_path) > -1;
                    return (
                      <div key={childIndex}>
                        {
                          canEdit ? (
                            <Checkbox key={childIndex} value={childKey}>
                              {
                                childName?.length >= 10 ? (
                                  <Tooltip title={childName}>
                                    {childName}
                                  </Tooltip>
                                ) : childName
                              }
                            </Checkbox>
                          ) : (
                            <Link to={path}>
                              <span key={childKey}
                                className={_isSelected ? styles.selected : ''}
                                onClick={() => { handleMenuClick(path) }}>
                                {childName}
                              </span>
                            </Link>
                            )
                        }
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        }
      })
    }
    return (
      <div className={styles.menuPopup}>
        {
          canEdit ? (
            <div className={styles.menuHeader}>
              <div className={styles.count}>
                固定至导航栏（{chooseMenus.length}/6）
            </div>
              <div className={styles.buttonWrapper}>
                <span className={`${styles.save} ${styles.btn}`} onClick={handleSaveMenu}>保存</span>
                <span className={`${styles.cancel} ${styles.btn}`} onClick={handleCancel}>取消</span>
              </div>
            </div>
          ) : null
        }
        <div>
          {
            canEdit ? (
              <div className={`${styles.menuWrapper}`}>
                {
                  <Checkbox.Group value={chooseMenus} className={styles.menuCheckboxContent} onChange={handleChecked}>
                    {
                      renderShowPopupContent()
                    }
                  </Checkbox.Group>
                }
              </div>
            ) : <div className={styles.menuWrapper}>
                {
                  renderShowPopupContent()
                }
              </div>
          }
        </div>
      </div>
    )
  }

  const jumpHome = () => {
    history.replace('/home')
  }

  return (
    <div onClick={stopPropagtion} className={styles.headerMenuContainer}>
      <div className={styles.menuListWrapper}>
        <div className={styles.menuIcon} onClick={jumpHome}>
          <Popover
            visible={false}
            trigger='click'
            >
            <div className={styles.icon}/>
            首页
          </Popover>
        </div>
        <div className={` ${styles.menuIcon}`}>
          <Popover
            visible={menuShow}
            placement="bottomLeft"
            overlayClassName={styles.popupWrapper}
            onVisibleChange={(value) => { setMenuShow(value) }}
            content={renderShowPopup(false)}>
            <div className={styles.iconDefault} />
            菜单
          </Popover>
        </div>
        <div className={styles.menuRenderWrapper}>
          {renderMenus()}
        </div>
        <div className={styles.menuRenderWrapper}>
          {renderDefaultMenus()}
        </div>
        <div className={` ${styles.menuIcon}`} >
          <Popover
            visible={addMenuShow}
            trigger="['click']"
            overlayClassName={styles.popupWrapper}
            onVisibleChange={(value) => { setAddMenuShow(value) }}
            content={renderShowPopup(true)}>
            <div className={styles.iconAdd} />
          </Popover>
        </div>
      </div>
    </div>
  )
}

export default connect()(HeaderMenu)
