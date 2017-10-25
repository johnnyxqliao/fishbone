package xjtu.web.action;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.SessionAware;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by Json Wan on 2017/4/28.
 * Description:
 */
public class IndexAction extends BaseAction{

    public String index(){
        String username=getUserName();
        System.out.println("username="+username);
        return SUCCESS;
    }
}
