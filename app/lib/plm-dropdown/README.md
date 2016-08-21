# PLM UI Dropdown Widget
This module holds files of dropdown widget.  

## Demo
[See demo here](https://git.autodesk.com/pages/plm-ui/plm-dropdown/).

## Usage
Include module `com/autodesk/dropdown.js`.

### Example
```
<dropdown-widget anchor="#user-profile-dropdown-button" h-pos="{{pos}}">
    <div>
        <span>My</span>
        <span>Text</span>
    </div>
    <ul>
        <li>
            <button ng-click="hello();">
                Click Me
            </button>
        </li>
    </ul>
</dropdown-widget>
```
